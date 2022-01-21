const mongoose = require('mongoose');
const messageSchema = require("./components/messageSchema")

const chatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciever:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    newMessages: {
        sender: Boolean,
        reciever: Boolean
    },
    messages:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sent: {
            type: Date,
            required: true
        },
        message: {
            type: String,
            required: true
        },
    }]
})

module.exports = mongoose.model('Chat', chatSchema);