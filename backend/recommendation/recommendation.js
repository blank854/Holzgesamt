const Offer = require("../api/model/offerModel");

const recommendationEngine = async function (offer) {
    const recommendations = []
    const offerList = await Offer.find().catch()
    offerList.forEach((item,index)=>{
        if (!item._id.equals(offer._id)){

            const similarityHeight = _similarityHeight(offer.treeDetail.dimensions.height, item.treeDetail.dimensions.height)
            const similarityCircumference = _similarityCircumference(offer.treeDetail.dimensions.circumference, item.treeDetail.dimensions.circumference)
            const similarityLocation =  _similarityLocation(offer.treeDetail.location, item.treeDetail.location)
            const similaritySpecies =   _similaritySpecies(offer.treeDetail.species.german, item.treeDetail.species.german)
            const similarityPrice =  _similarityPrice(offer.price, item.price)
            const similarityFelled =  _similarityFelled(offer.treeDetail.fellingState.felled, item.treeDetail.fellingState.felled)

            const similarityScore = (   0.25 * similarityHeight * similarityHeight + 
                                        2 * similarityLocation * similarityLocation +
                                        0.25 * similarityCircumference * similarityCircumference +
                                        1.5 * similaritySpecies * similaritySpecies + 
                                        1 * similarityPrice * similarityPrice +
                                        0.5 * similarityFelled * similarityFelled
                                        ) / 5.5;
            recommendations.push({  score:similarityScore,
                                    offer:item._id })

            let smalestScore = 1;
            let smalestIndex = 0;
            item.recommendations.forEach((recItem, recIndex)=>{
                if (recItem.score < smalestScore) {
                    smalestScore = recItem.score;
                    smalestIndex = recIndex;
                }
            })

            if (smalestScore < similarityScore || item.recommendations.length === 0){
                item.recommendations[smalestIndex] = {
                    score: similarityScore,
                    offer: offer._id
                }
               Offer.findByIdAndUpdate(item._id, {recommendations: item.recommendations}).catch(e=>{console.log(e)})
            }
        }
    })
    recommendations.sort(( a, b ) => {
        if ( a.score > b.score ) return -1;
        if ( a.score < b.score ) return 1;
        return 0;
    })
    Offer.findByIdAndUpdate(offer._id, {recommendations: recommendations.slice(0,5)}).catch(e=>{console.log(e)})
}

const _similarityHeight = function(offer, reference){
        if (offer && reference){
            let max = Math.max(offer,reference)
            let min = Math.min(offer,reference)
            if (max !== 0){
                return min/max
            }
        }
        return 0
}
const _similarityCircumference = function(offer, reference){
    if (offer && reference){
        let max = Math.max(offer,reference)
        let min = Math.min(offer,reference)
        if (max !== 0){
            return min/max
        }
    }
    return 0
}

const _similarityLocation = function(offer, reference){
	var lat1 = offer.coordinates[0] * Math.PI / 180;
	var lat2 = reference.coordinates[0] * Math.PI / 180;
	var lon1 = offer.coordinates[1] * Math.PI / 180;
	var lon2 = reference.coordinates[1] * Math.PI / 180;

	var R = 6371; // km
	var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
	var y = (lat2-lat1);
	var distance = Math.sqrt(x*x + y*y) * R;
    var q = 1000 - distance;
    if (q <= 0){
        return 0
    } else {
        return q/1000
    }
}

const _similaritySpecies = function(offer, reference){
    let offerSpec = offer.toUpperCase();
    let referneceSpec = reference.toUpperCase()
    if (offerSpec === referneceSpec){
        return 1
    } else if( offerSpec.includes(referneceSpec) || referneceSpec.includes(offerSpec)){
        return 0.5
    } else {
        return 0
    }
}
const _similarityPrice = function(offer, reference){
        let maxPrice = Math.max(offer.priceValue,reference.priceValue)
        let minPrice = Math.min(offer.priceValue,reference.priceValue)
        if (maxPrice !== 0){
            const relativPrice = minPrice/ ( 2*maxPrice);
            const absolutPrice = ( 1000 - maxPrice + minPrice ) / 2000
            if (absolutPrice < 0) absolutPrice = 0;
            return absolutPrice + relativPrice
        } else if( maxPrice === minPrice){
            return 1
        }
        return 0

}

const _similarityFelled = function(offer, reference){
    if (offer === reference) return 1;
    return 0;
}

module.exports = recommendationEngine