const mongoose = require('mongoose');
const locationSchema = require("./components/locationSchema")
// const AlgoliaBatch = require('../model/algoliaBatchModel')
// const algoliarecommend = require('@algolia/recommend');
// const algoliaSearch = require("algoliasearch")
// const algoliaRecommendClient = algoliarecommend(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
// const algoliaSearchClient = algoliaSearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
// const algoliaIndex = algoliaSearchClient.initIndex('HolzProjektInserate');


const offerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        priceType: {
            type: String,
            enum: ["Festpreis", "Verhandlungsbasis","Geschenk"],
            required : true,
        },
        priceValue: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prospects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    created: Date,
    lastUpdated: Date,
    status: {required : true, type: String, enum:["Vorlage","Gesperrt","Gelöscht","Offen","Geschlossen"]},
    treeDetail: {
        location: { type: locationSchema
        },
        species: { 
            german: {
                type: String,
                required: true
            },
            latin: String
        },
        dimensions: {
            height: mongoose.Schema.Types.Number,
            circumference: mongoose.Schema.Types.Number
        },
        quality: String,
        accessibility: String,
        timeWindow:{
            restricted: Boolean,
            from: Date,
            till: Date
        },
        protectionState: String,
        fellingState: {
            felled: {
                type: Boolean,
                required: true
            },
            fellingDate: Date,
            
        }
    },
    pictures: [{
        title: String,
        access: String
    }],
    scores:{
        favorites: Number,
        contacts: Number,
        detailViews: Number,
        scoreRank: Number,
    },
    recommendations:[{
        score: Number,
        offer:{type: mongoose.Schema.Types.ObjectId,
                ref: 'Offer'}
        }]
})

offerSchema.index({ "treeDetail.location" : '2dsphere' });

offerSchema.statics.findMax = function () {

    return new Promise((resolve, reject)=>{
        this.findOne()
            .sort({"price.priceValue" : -1})
            .exec()
            .then(offer =>{resolve(offer)})
            .catch(err => {reject(err)})
    })
}

// offerSchema.statics.updateAlgolia = async function (update){
//     AlgoliaBatch
//     .findOne()
//     .then(algoliaBatch=>{

//         const updateBatch = new AlgoliaBatch({ offer : algoliaBatch.offer })

//         if (!algoliaBatch.offer.includes(update._id)){
//             updateBatch.offer.push(update._id)
//         }  

//         updateBatch.counter  = algoliaBatch.counter + 1

//         if (updateBatch.counter > 9){
//             this.find({_id: { $in: updateBatch.offer }})
//             .then(DBRecords =>{
//                 const sendRecords = []
//                 DBRecords.forEach((item, index)=>{
//                     sendRecords.push({
//                         objectID : item._id,
//                         title : item.title,
//                         description: item.description, 
//                         price: item.price,
//                         speciesGerman: item.treeDetail.species.german,
//                         height: item.treeDetail.dimensions.height,
//                         circumference: item.treeDetail.dimensions.circumference,
//                         quality: item.treeDetail.quality,
//                         accessibility: item.treeDetail.accessibility,
//                         fellingState: item.treeDetail.fellingState.felled,
//                         favoritesScore: item.scores.favorites,
//                         contactsScore: item.scores.contacts,
//                         detailViewsScore: item.scores.detailViews,
//                     })
//                 })
//                 algoliaIndex.saveObjects(sendRecords, { autoGenerateObjectIDIfNotExist: true })
//                 .then(({ objectIDs }) => {
//                     console.log(objectIDs);
//                   })
//                   .catch(err => {
//                     console.log(err);
//                   });
                

//             })
//             .catch((err) => { return });
//             updateBatch.offer = []
//             updateBatch.counter = 0
//         }
//         AlgoliaBatch.findOneAndUpdate(algoliaBatch._id,updateBatch).catch(error=>{console.log(error)})
//     })
//     .catch(error =>{
//         console.log(error)
//         algoliaBatch = new AlgoliaBatch({
//             _id: new mongoose.Types.ObjectId(),
//             offer: [update._id],
//             counter: 1
//         })
//         algoliaBatch.save()
//     })
//     return
// }

// offerSchema.statics.deleteAlgolia = function (update){
//     algoliaIndex.deleteObjects([update._id]);
//     return
// }
// offerSchema.statics.getRecomAlgolia = function (offerID){
//     console.log(offerID)

//     return new Promise((resolve, reject)=>{
//          console.log(algoliaIndex)
//         // algoliaSearchClient.listIndices().then(res=>{console.log(res)})
        
//         algoliaRecommendClient.getRelatedProducts([
//             {
//               indexName: 'HolzProjektInserate',
//               objectID: offerID,
//              // model: 'bought-together',
//              // maxRecommendations: 5
//             }
//           ])
//           .then(({ results }) => {
//             console.log(results);
//             resolve(results)
//           })
//           .catch(err => {
//             console.log(err);
//             reject(err)
//           }); 
//     }) 
// }

module.exports = mongoose.model('Offer', offerSchema);