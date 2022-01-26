const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Offer = require('../model/offerModel')
const treeJSON = require('../../treeSpecies.json')
const Usages = require('../../usages.json')
const clean = require("../../clean");

router.get('/maximalPrice', (req, res, next) => {
    Offer.findMax()
        .then((offer) => {
            res.status(200).json({
                max: offer.price.priceValue,
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
})

router.get('/treeSpecies', (req, res, next) => {
    res.status(200).json({ treeJSON })
})

router.get('/usages', (req, res, next) => {
    const SendUsages = [];
    Usages.forEach((item, index) => {
        SendUsages.push(item.usage)
    })
    SendUsages.sort()
    res.status(200).json({ SendUsages })
})

router.get('/treeSpecies/:filterString', (req, res, next) => {
    let result = []
    treeJSON.forEach((item, index) => {
        if (
            item.treeSpeciesGerman
            .toLowerCase()
            .includes(req.params.filterString.toLowerCase())
        ) {
            result.push(item)
        }
    })
    res.status(200).json({ result })
})

router.get('/test', (req, res, next) => {
clean()
res.status(200)
})

module.exports = router
