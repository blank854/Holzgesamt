const express = require("express");
const User = require("../model/userModel");
require('dotenv').config()

module.exports = (req, res, next) => {
    if (typeof req.query.id != 'undefined' && req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOneAndUpdate({ _id: req.query.id }, { status: "Verifiziert" })
            .exec()
            .then(user => {
                console.log(`E-Mail "${user.email}" wurde erfolgreich verifiziert.`);
                next()
            });
    } else {
        res.send('<h1>404: The requested URL was not found on this server.</h1>');
    }
}