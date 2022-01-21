const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    timestamp: Date,
    interactionType: {required : true, type: String, enum:["DetailSicht","Favorit","Kontakt"]},
})

module.exports = mongoose.model('eventLog', eventSchema);