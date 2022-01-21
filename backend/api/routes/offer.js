const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/authCheck");
const Offer = require("../model/offerModel");
const mongoose = require("mongoose");
const recommendationEngine = require("../../recommendation/recommendation")
const EventLog = require('../model/eventModel')
const jwt = require('jsonwebtoken');
const axios = require("axios")
require('dotenv').config()

/**
 * @GET all Offers
 */
router.get("/", (req, res, next) => {

    const requestFilters = req.body.filters;
    let sorter = {};
    const requestSearch = req.body.search;
    const requestPaging = req.body.paging;
    const filter = {};
    var skip;
    var limit;

    if ( typeof requestFilters !== "undefined"){
        requestFilters.forEach((item, index) => {
            if (item.field === "treeDetail.location"){
                filter[item.field] = {
                    $near: {$maxDistance: parseInt(item.maxDistance),
                            $geometry: {type: "Point",coordinates: item.coordinates}}
                }
            } else {
                filter[item.field] = item.value;
            }
        })
    }
    if ( typeof requestSearch !== "undefined"){
        filter["title"] = { $regex: requestSearch.value }
        filter["description"] = { $regex: requestSearch.value }
    }
    if ( typeof requestPaging !== "undefined"){
        limit = requestPaging.limit
        skip = requestPaging.skip
    }
    if ( typeof requestPaging !== "undefined"){
        sorter = req.body.sorter
    } 
    //sorter["score.scoreRank"] = -1;

    Offer
        .find(filter)
        .limit(limit)
        .skip(skip)
        .select("_id created lastUpdated treeDetail.species fellingState title price pictures")
        .sort(sorter)
        .exec()
        .then(offers =>{ res.status(200).json(offers)})
        .catch(err => {res.status(500).json({message:"Error while reading offers", error:err})})
});

router.post("/",authCheck, async (req, res, next) => {
    const Treedetail = req.body.treeDetail;
    let location = {
    }
    if (Treedetail.location.coordinates){
        location = Treedetail.location
    }
    if (Treedetail.location.zip){
        const baseURl = `https://maps.googleapis.com/maps/api/geocode/json?address=`
        const sendURL = `${baseURl}${Treedetail.location.zip}&key=${process.env.GOOGLE_API_KEY}`
    
        const googleResponse = await axios({ method: 'get', url:sendURL }).catch((error)=>{ console.log(error);
                                                                                            res.status(500).json({error:error})
                                                                                            return});
        try{
            location = {
                type: "Point",
                coordinates:[googleResponse.data.results[0].geometry.location.lat,
                            googleResponse.data.results[0].geometry.location.lng]
            }
        } catch(e){ res.status(500).json({Error:"Postleitzahl-Error"});return}

    }

    Treedetail.location = location
   
    const offer = new Offer( {
        _id: new mongoose.Types.ObjectId(),
        user: req.authUserData.userId,
        created: Date(),
        lastUpdated: Date(),
        treeDetail: Treedetail,
        status: "Offen",
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        pictures: req.body.pictures,
        scores:{
            favorites: 0,
            contacts: 0,
            detailViews: 0,
            scoreRank: 0
        }
    })
    if (offer.pictures.length == 0){
        offer.pictures.push({access: "https://holzprojektaws.s3.amazonaws.com/1642584009456.png"})
    }

    offer
    .save()
    .then(offerResult => {  recommendationEngine(offerResult)
                            res.status(200).json({offerResult});})
    .catch(err => {res.status(500).json({message:"Error while saving offers", error:err})})
});

router.put("/",authCheck, (req, res, next) => {
   var oID = req.body._id
   Offer.findById(oID)
   .exec()
   .then(offer => {
        if (offer.user === req.authUserData.userId){
            const offerUpdate = new Offer( {
                _id: oID,
                created: req.body.created,
                lastUpdated: Date(),
                status: "Offen",
                treeDetail: req.body.treeDetail,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                pictures: req.body.pictures,
                scores:{
                    favorites: 0,
                    contacts: 0,
                    detailViews: 0,
                    scoreRank: 0
                }
            })
        Offer.findByIdAndUpdate(oID, offerUpdate)
            .exec()
            .then(offerResult =>{res.status(200).json(offerResult)})
            .catch(err => {res.status(500).json({message:"Error while updating offers", error:err})})
         } else {
             res.status(401).json({ message: "userID doesnt match with token" });
         }
    })
   .catch(err=>{res.status(500).json({message:"Error while finding offer", error:err})})
   

});

router.get("/:offerID", (req, res, next) => {
    const oID = req.params.offerID
    Offer
        .findByIdAndUpdate(oID,{$inc : {'scores.detailViews' : 1}})
        .populate("user","username")
        .populate("recommendations.offer","_id created lastUpdated treeDetail.species fellingState title price pictures")
        .exec()
        .then(offerResult =>{ 
            let sendResult = {...offerResult.toObject()}
            const reconsNew = []
            offerResult.recommendations.forEach((item, index)=>{
                const flatRecom = {
                    ...item.offer.toObject(),
                    score: item.score
                }
                reconsNew.push(flatRecom)
            })
            sendResult.recommendations = reconsNew
            res.status(200).json(sendResult)})
        .catch(err => {res.status(500).json({message:"Error while finding offers",error:err})})

            try{
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token,process.env.JWTKEY);
                const eventLog = new EventLog({
                    _id: new mongoose.Types.ObjectId(),
                    user: decoded.userId,
                    offer: oID,
                    timestamp: Date(),
                    interactionType: "DetailSicht",
                })
                eventLog.save().catch(er=>{console.log(er)})
            } catch (e){console.log(e)}

});

router.delete("/:offerID",authCheck, (req, res, next) => {
    var oID = req.params.offerID
    Offer
        .findByIdAndDelete(oID)
        .exec()
        .then(offerResult =>{res.status(200).json(offerResult)})
        .catch(err => {res.status(500).json({message:"Error while deleting offers",error:err})})
});

module.exports = router;