const express = require('express')
const router = express.Router()
const authCheck = require('../middleware/authCheck')
const mailSender = require('../middleware/mailSender')
const Chat = require('../model/chatModel')
const Offer = require('../model/offerModel')
const User = require('../model/userModel')
const mongoose = require('mongoose')
require('dotenv').config()

router.get("/:chatId", authCheck, (req, res, next) => {
    const oID = req.params.chatId;
    Chat
        .findOne({ _id: oID })
        .populate('offer', "title")
        .populate({ path: "reciever", select: "username" })
        .populate({ path: "sender", select: "username" })
        .exec()
        .then(result => {

            if (req.authUserData.userId != result.sender._id && req.authUserData.userId != result.reciever._id) res.status(500).json({ message: "Chat belongs to other IDs" })
            res.status(200).json({ result })
            if (req.authUserData.userId == result.sender) {
                result.newMessages.sender = false;
            } else {
                result.newMessages.reciever = false;
            }
            const update = {
                newMessages: result.newMessages
            } 

        })
        .catch((err) => { res.status(500).json({ message: "Error while finding chat", error: err }) })
});

router.post("/message", authCheck, (req, res, next) => {
    var senderNew = false;
    var recieverNew = false
    const message = {
        user: req.authUserData.userId,
        sent: Date(),
        message: req.body.message
    }
    const oID = req.body.chatId

    Chat.findById(oID).exec().then(result => {

        if (req.authUserData.userId == result.sender) {
            recieverNew = true;
        } else {
            senderNew = true;
        }

        result.messages.push(message)
        const update = {
            newMessages: {
                sender: senderNew,
                reciever: recieverNew
            },
            messages: result.messages
        }

        Chat.findByIdAndUpdate(oID, update)
            .exec()
            .then((chatResult) => { res.status(200).json({ chatResult }) })
            .catch(err => { res.status(500).json({ message: "Error while updating chat", error: err }) })
    })
})



router.post('/', authCheck, async(req, res, next) => {
    const offer = await Offer.findById(req.body.offer).catch((err) => {
        res.status(500).json({ message: 'Offer does not exist', error: err })
        return
    })
    const findChat = await Chat.findOne({
        sender: req.authUserData.userId,
        reciever: offer.user,
        offer: req.body.offer,
    }).catch((error) => {})

    if (findChat) {
        res.status(200).json({ findChat })
        return
    }

    if (!req.body.message) {
        res.status(400).json({ message: 'Please send a message', error: err })
        return
    }

    Offer.findByIdAndUpdate(req.body.offer, {$inc : {'scores.contacts' : 1, "scores.scoreRank": 10 }})
        .exec()

    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        sender: req.authUserData.userId,
        reciever: offer.user,
        offer: req.body.offer,
        newMessages: {
            sender: false,
            reciever: false,
        },
        messages: [{
            user: req.authUserData.userId,
            sent: Date(),
            message: req.body.message,
        }, ],
    })

    chat.save().then((chatResult) => {
        User.findById(chatResult.sender)
            .exec()
            .then((userResult) => {
                if (Array.isArray(userResult.chats)) {
                    userResult.chats.push(chatResult._id)
                } else {
                    userResult.chats[0] = chatResult._id
                }

                const update = {
                    chats: userResult.chats,
                }
                User.findByIdAndUpdate(chatResult.sender, update)
                    .exec()
                    .then((updResult) => {
                        User.findById(chatResult.reciever)
                            .exec()
                            .then((userResult2) => {
                                if (Array.isArray(userResult2.chats)) {
                                    userResult2.chats.push(chatResult._id)
                                } else {
                                    userResult2.chats[0] = chatResult._id
                                }
                                const update = {
                                    chats: userResult2.chats,
                                }
                                User.findByIdAndUpdate(chatResult.reciever, update)
                                    .exec()
                                    .then((upd2Result) => {
                                        mailSender.sendMail({
                                            email: userResult2.email,
                                            forename: userResult2.forename,
                                            offerId: offer._id,
                                            offerName: offer.title,
                                            requesterId: userResult._id,
                                            requesterUsername: userResult.username,
                                            firstMessage: chat.messages[0].message
                                        }, 'offerRequest');
                                        res.status(200).json({ chatResult })
                                    })
                            })
                            .catch((err) => {
                                res
                                    .status(500)
                                    .json({ message: 'Error while searching user', error: err })
                            })
                    })
            })
    })
})

module.exports = router