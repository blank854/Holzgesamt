const Offer = require("../backend/api/model/offerModel");
const User = require("../backend/api//model/userModel");
const Chats = require("../backend/api//model/chatModel");
const initRecommendation = require("../backend/recommendation/initRecomm");
const mongoose = require("mongoose");

const cleanDatabase = async function(){
    cleanUser()
    cleanOffer()
    initRecommendation()
}
const cleanUser = async function(){
    const userList = await User.find().exec()
    userList.forEach( (item,index)=>{
        let change = false;
        //Clean up offers
        let offersChange = item.offers
        item.offers.forEach((offerItem,offerIndex)=>{
            Offer.exists({ _id: offerItem }, function (err, doc) {
                if (err){
                    offersChange.splice(offerIndex, 1)
                    change = true
                }
            });
        })
        //clean up favorites
        let favoritesChange = item.favorites
        item.favorites.forEach((favoritesItem,favoritesIndex)=>{
            Offer.exists({ _id: favoritesItem }, function (err, doc) {
                if (err){
                    favoritesChange.splice(favoritesIndex, 1)
                    change = true
                }
            });
        })
        //clean up chats
        let chatsChange = item.chats
        item.chats.forEach((chatsItem,chatsIndex)=>{
            Chats.exists({ _id: chatsItem }, function (err, doc) {
                if (err){
                    chatsChange.splice(chatsIndex, 1)
                    change = true
                }
            });
        })
        const update = {
            chats: chatsChange,
            offers: offersChange,
            favorites: favoritesChange
        }
        if (change){
            User.findByIdAndUpdate(item._id,update).exec()
        }
    })
}
const cleanOffer = async function(){
    const offerList = await Offer.find().populate({path: "user", select: "offers"}).exec()
    offerList.forEach( (item,index)=>{

        if (!item.user.offers.includes(item._id)){
            item.user.offers.push(item._id)
            let userUpdate = {offers: item.user.offers}
            console.log(item.user._id, userUpdate)
            User.findByIdAndUpdate(item.user._id,userUpdate).exec().catch(e=>{console.log(e)})
        }

        let updateScores = item.scores;
        item.scores.scoreRank = item.scores.favorites * 5 + item.scores.detailViews + item.scores.contacts * 10

        const update = {
            scores: updateScores,
        }
        Offer.findByIdAndUpdate(item._id,update).exec()
    })
}

module.exports = cleanDatabase