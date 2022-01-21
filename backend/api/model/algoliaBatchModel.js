const mongoose = require('mongoose');

const algoliaBatchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    offer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    }],
    counter: Number
})

module.exports = mongoose.model('algoliaBatch', algoliaBatchSchema);