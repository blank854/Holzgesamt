const express = require('express')
const router = express.Router()
const authCheck = require('../middleware/authCheck')
const Offer = require('../model/offerModel')
const User = require('../model/userModel')
const mongoose = require('mongoose')
const recommendationEngine = require('../../recommendation/recommendation')
const axios = require('axios')
const initRecommendation = require('../../recommendation/initRecomm')

const treeUsages = require('../../usages.json')
require('dotenv').config()

/**
 * @GET all Offers
 * @todo: Zip filter
 */
router.post('/getAll', async (req, res, next) => {
  // initRecommendation()
  console.log(req.body)

  const requestFilters = req.body.filters
  let sorter = {}
  const requestSearch = req.body.search
  const requestPaging = req.body.paging
  let filter = {}
  let filterOr = []
  let filterAnd = []
  const requestUsage = req.body.usage
  var skip
  var limit
  var countEntries

  if (typeof requestFilters !== 'undefined') {
    for (const item of requestFilters) {
      if (item.field === 'treeDetail.location') {
        const baseURl = `https://maps.googleapis.com/maps/api/geocode/json?address=`
        const sendURL = `${baseURl}${item.zip}&region=DE&key=${process.env.GOOGLE_API_KEY}`

        const googleResponse = await axios({
          method: 'get',
          url: sendURL,
        }).catch((error) => {
          console.log(error)
          res.status(500).json({ error: error })
          return
        })
        try {
          if (googleResponse.data.results.length > 0) {
            filterAnd.push({
              [item.field]: {
                $near: {
                  $maxDistance: parseInt(item.maxDistance),
                  $geometry: {
                    type: 'Point',
                    coordinates: [
                      googleResponse.data.results[0].geometry.location.lat,
                      googleResponse.data.results[0].geometry.location.lng,
                    ],
                  },
                },
              },
            })
          }
        } catch (err) {
          res.status(500).json({ message: 'Postleitzahl-Error', error: err })
          return
        }
      } else {
        filterAnd.push({ [item.field]: item.value })
      }
    }
  }
  if (typeof requestSearch !== 'undefined') {
    filterOr.push({ title: { $regex: requestSearch.value, $options: 'i' } })
    filterOr.push({
      description: { $regex: requestSearch.value, $options: 'i' },
    })
  }
  if (typeof requestPaging !== 'undefined') {
    limit = requestPaging.limit
    skip = requestPaging.skip
    countEntries = requestPaging.count
  }
  if (typeof req.body.sorter !== 'undefined') {
    sorter = req.body.sorter
  }

  if (typeof requestUsage !== 'undefined') {
    treeUsages.forEach((item, index) => {
      if (item.usage == requestUsage) {
        if (filter['treeDetail.species.german']) {
          filter['treeDetail.species.german'] = [
            filter['treeDetail.species.german'],
          ].concat(item.species)
        } else {
          filter['treeDetail.species.german'] = item.species
        }
      }
    })
  }
  if (filterOr.length > 0) filter['$or'] = filterOr
  if (filterAnd.length > 0) filter['$and'] = filterAnd

  sorter['scores.scoreRank'] = -1

  if (countEntries) {
    Offer.find(filter)
      .select(
        '_id created lastUpdated treeDetail.species fellingState title price pictures'
      )
      .sort(sorter)
      .exec()
      .then((offers) => {
        const length = offers.length
        const sendOffers = offers.splice(skip, limit)

        res.status(200).json({ count: length, offers: sendOffers })
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Beim Abfragen der Inserate ist ein Fehler aufgetreten.',
          error: err,
        })
      })
  } else {
    Offer.find(filter)
      .limit(limit)
      .skip(skip)
      .select(
        '_id created lastUpdated treeDetail.species fellingState title price pictures'
      )
      .sort(sorter)
      .exec()
      .then((offers) => {
        res.status(200).json({ count: false, offers: offers })
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Beim Abfragen der Inserate ist ein Fehler aufgetreten.',
          error: err,
        })
      })
  }
})

router.post('/', authCheck, async (req, res, next) => {
  const Treedetail = req.body.treeDetail
  console.log(Treedetail)
  let location = {}
  if (Treedetail.location.coordinates) {
    location = Treedetail.location
  }
  if (Treedetail.location.zip) {
    const baseURl = `https://maps.googleapis.com/maps/api/geocode/json?address=`
    const sendURL = `${baseURl}${Treedetail.location.zip}&region=DE&key=${process.env.GOOGLE_API_KEY}`

    const googleResponse = await axios({ method: 'get', url: sendURL }).catch(
      (err) => {
        console.log(err)
        res.status(500).json({ error: err })
        return
      }
    )

    try {
      if (googleResponse.data.results.length > 0) {
        location = {
          type: 'Point',
          coordinates: [
            googleResponse.data.results[0].geometry.location.lat,
            googleResponse.data.results[0].geometry.location.lng,
          ],
        }
      }
    } catch (err) {
      res.status(500).json({ message: 'Postleitzahl-Error', error: err })
      return
    }
  }

  Treedetail.location = location

  const offer = new Offer({
    _id: new mongoose.Types.ObjectId(),
    user: req.authUserData.userId,
    created: Date(),
    lastUpdated: Date(),
    treeDetail: Treedetail,
    status: 'Offen',
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    pictures: req.body.pictures,
    scores: {
      favorites: 0,
      contacts: 0,
      detailViews: 0,
      scoreRank: 0,
    },
  })
  if (offer.pictures.length == 0) {
    offer.pictures.push({
      access: 'https://holzprojektaws.s3.amazonaws.com/1642584009456.png',
    })
  }

  offer
    .save()
    .then(async (offerResult) => {
      try {
        recommendationEngine(offerResult)
        res.status(200).json({ offerResult })
        const postUser = await User.findById(req.authUserData.userId).exec()
        if (Array.isArray(postUser.offers)) {
          postUser.offers.push(offerResult._id)
        } else {
          postUser.offers[0] = offerResult._id
        }
        const updateUser = { offers: postUser.offers }
        User.findByIdAndUpdate(req.authUserData.userId, updateUser).exec()
      } catch (err) {
        console.log(err)
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Beim Aktualisieren der Inserate ist ein Fehler aufgetreten.',
        error: err,
      })
    })
})

router.put('/', authCheck, (req, res, next) => {
  var oID = req.body._id
  Offer.findById(oID)
    .exec()
    .then((offer) => {
      if (offer.user === req.authUserData.userId) {
        const offerUpdate = new Offer({
          _id: oID,
          created: req.body.created,
          lastUpdated: Date(),
          status: 'Offen',
          treeDetail: req.body.treeDetail,
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          pictures: req.body.pictures,
          scores: {
            favorites: 0,
            contacts: 0,
            detailViews: 0,
            scoreRank: 0,
          },
        })
        Offer.findByIdAndUpdate(oID, offerUpdate)
          .exec()
          .then((offerResult) => {
            res.status(200).json(offerResult)
          })
          .catch((err) => {
            res.status(500).json({
              message:
                'Beim Aktualisieren des Inserats ist ein Fehler aufgetreten.',
              error: err,
            })
          })
      } else {
        res.status(401).json({ message: 'Die User-ID passt nicht zum Token.' })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Beim Suchen des Inserats ist ein Fehler aufgetreten.',
        error: err,
      })
    })
})

router.get('/:offerID', (req, res, next) => {
  const oID = req.params.offerID
  console.log(oID)
  Offer.findByIdAndUpdate(oID, {
    $inc: { 'scores.detailViews': 1, 'scores.scoreRank': 1 },
  })
    .populate('user', 'username')
    .populate(
      'recommendations.offer',
      '_id created lastUpdated treeDetail.species fellingState title price pictures'
    )
    .exec()
    .then((offerResult) => {
      try {
        let sendResult = { ...offerResult.toObject() }
        const reconsNew = []
        offerResult.recommendations.forEach((item, index) => {
          if (item.offer !== null) {
            const flatRecom = {
              ...item.offer.toObject(),
              score: item.score,
            }
            reconsNew.push(flatRecom)
          }
        })

        sendResult.recommendations = reconsNew
        res.status(200).json(sendResult)
      } catch (err) {
        console.log(
          res.status(500).json({
            message: 'Beim Suchen des Inserats ist ein Fehler aufgetreten.',
            error: err,
          })
        )
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Beim Suchen des Inserats ist ein Fehler aufgetreten.',
        error: err,
      })
    })
})

router.delete('/:offerID', authCheck, (req, res, next) => {
  var oID = req.params.offerID
  Offer.findByIdAndDelete(oID)
    .exec()
    .then((offerResult) => {
      res.status(200).json(offerResult)
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Beim Löschen des Inserats ist ein Fehler aufgetreten.',
        error: err,
      })
    })
})

module.exports = router
