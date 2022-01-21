const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    forename: String,
    surname: String,
    status: {required : true, type: String, enum:["Erstellt","Verifiziert","Gesperrt"]},
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    userPreferences:{
        emailNotification: Boolean
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }],
    chats:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    favorites: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Offer'
            }]
});

module.exports = mongoose.model('User', userSchema);