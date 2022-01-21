const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authCheck = require("../middleware/authCheck");
const verification = require("../middleware/verifyUser");
const path = require('path');
const mailSender = require('../middleware/mailSender');
const User = require("../model/userModel");
const Offer = require("../model/offerModel");
const EventLog = require('../model/eventModel')
require('dotenv').config()

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({ message: "Mail exists" });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            username: req.body.username,
                            forename: req.body.forename,
                            surname: req.body.surname,
                            status: "Erstellt",
                            password: hash,
                            role: "user",
                        });

                        user
                            .save()
                            .then(result => {
                                mailSender.sendMail({
                                    uId: user._id,
                                    email: user.email,
                                    forename: user.forename
                                }, 'verification');
                                res.status(201).json({ message: "User created" });
                            })
                            .catch(err => { res.status(500).json({ message: "Error while creating user", error: err }); });
                    }
                });
            }
        });
});

router.post("/login", (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ message: "Auth failed" });
            } else if (user[0].status !== 'Verifiziert') {
                return res.status(401).json({ message: "User is not verified or blocked" });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) { return res.status(401).json({ message: "Authorization failed" }); }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWTKEY, { expiresIn: "1d" }
                    );
                    const Expiration = new Date();
                    Expiration.setDate(Expiration .getDate() + 1);

                    return res.status(200).json({
                        token: token,
                        expires: Expiration,
                        email: user[0].email,
                        userId: user[0]._id,
                        username: user[0].username
                    });
                }
                res.status(401).json({ message: "Auth failed" });
            });
        })
        .catch(err => {
            res.status(500).json({ message: "Authorization failed", error: err });
        });
});

router.delete("/favorite", authCheck, (req, res, next) => {
    const oID = req.authUserData.userId
    User
        .findById(req.authUserData.userId)
        .exec()
        .then(result => {
            try{
                const favID = mongoose.Types.ObjectId(req.body.favorite) ;
                const index = result.favorites.indexOf(favID);
                console.log(index)
                if (index === -1) {
                    res.status(500).json({ message: "favorite is not in user" });
                } else {
                    result.favorites.splice(index,1)
                    const update = {
                        favorites: result.favorites
                    };
                    User.findByIdAndUpdate(oID, update)
                        .exec()
                        .then(result => { res.status(200).json({ message: "User updated" }); })
                        .catch(err => { res.status(500).json({ message: "Error while updating user", error: err }); })
            
                    Offer
                        .findByIdAndUpdate(oID,{$inc : {'scores.favorites' : -1}})
                        .exec()
            }
        } catch(e){console.log(e)}   
        })
        .catch(err => { res.status(500).json({ message: "User not found", error: err }) })

});

router.delete("/:userId", authCheck, (req, res, next) => {
    const oID = req.params.userId;
    if (req.authUserData.userId === oID) {
        User.remove({ _id: req.params.userId })
            .exec()
            .then(result => { res.status(200).json({ message: "User deleted" }); })
            .catch(err => {
                res.status(500).json({ message: "Error while removing user", error: err });
            });
    } else {
        res.status(401).json({ message: "userID doesnt match with token" })
    }
});

router.put("/", authCheck, (req, res, next) => {
    const oID = req.body._id;

    if (req.authUserData.userId === oID) {

        const update = {
            username: req.body.username,
            forename: req.body.forename,
            surname: req.body.surname,
            userPreferences: req.body.userPreferences
        };

        User.findByIdAndUpdate(oID, update)
            .exec()
            .then(result => { res.status(200).json({ message: "User updated" }); })
            .catch(err => {
                res.status(500).json({ message: "Error while updating user", error: err });
            });

    } else {
        res.status(401).json({ message: "userID doesnt match with token" })
    }
});

router.put("/favorite", authCheck, (req, res, next) => {
    const oID = req.authUserData.userId
    User
        .findById(req.authUserData.userId)
        .exec()
        .then(result => {
            try{
                const favID = mongoose.Types.ObjectId(req.body.favorite) 
                let update = []
                console.log(result)
                if (result.favorites.length > 0){
                    if (result.favorites.includes(favID )){
                        res.status(200).json({ message: "User already has this offer as favorite" });
                        return
                    }
                        result.favorites.push(favID )
                        update = {
                            favorites: result.favorites
                        }
                } else{
                       update = { favorites: [favID ] }
                }

            User.findByIdAndUpdate(oID, update)
                .exec()
                .then(result => { ;res.status(200).json({ message: "User updated" }); })
                .catch(err => { res.status(500).json({ message: "Error while updating user", error: err }); })
            Offer
                .findByIdAndUpdate(oID,{$inc : {'scores.favorites' : 1}})
                .exec()
        } catch(e){console.log(e)}
        })
        .catch(err => { res.status(500).json({ message: "User not found", error: err }) })

});



router.get("/", authCheck, (req, res, next) => {

    const oID = req.authUserData.userId;

    User.findById(oID)
        .select("_id username forename surname email status userPreferences chats offers favorites")
        .populate({ path: 'chats', 
                    select: 'sender reciever offer newMessages', 
                    populate: [ {   path: 'sender', 
                                    select: 'username' },
                                {   path: 'reciever', 
                                    select: 'username' },
                                {   path: 'offer', 
                                    select: 'title' }]})
        .populate({path: 'favorites', select: "_id created lastUpdated treeDetail.species fellingState title price pictures"})
        .exec()
        .then(result => { res.status(200).json({ result }); })
        .catch(err => { res.status(500).json({ error: err }); });

});

router.get("/verify", verification, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../staticHTML/verify.html'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Opened verification page...');
        }
    });
});


module.exports = router;