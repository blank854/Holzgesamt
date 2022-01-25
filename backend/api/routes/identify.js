const express = require('express')
const router = express.Router()
const axios = require("axios")
const mongoose = require('mongoose')
require('dotenv').config()

router.post("/", (req, res, next) => {

    if (!req.body.URL) res.status(500).json({ message: "Es wurde keine URL angegeben." })

    const baseURL = `https://my-api.plantnet.org/v2/identify/`
    const imagesURL = encodeURIComponent(req.body.URL)
    const sendURL = `${baseURL}all?api-key=${process.env.PLANT_API_KEY}&images=${imagesURL}`

    axios({
            method: 'get',
            url: sendURL,
        })
        .then(function(response) {
            const resultCount = 3
            const sendResponse = []
            if (response.data.results.length < 3) resultCount = response.data.results.length
            for (let i = 0; i < resultCount; i++) {
                sendResponse.push({
                    score: response.data.results[i].score,
                    species: response.data.results[i].species.scientificNameWithoutAuthor
                })
            }
            res.status(200).json(sendResponse)
        })
        .catch((error) => { console.log(error) });
})

module.exports = router