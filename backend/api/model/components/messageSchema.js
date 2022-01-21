const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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
});

module.exports =  messageSchema;