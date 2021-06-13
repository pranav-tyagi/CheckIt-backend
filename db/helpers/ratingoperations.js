const RatingCollection = require('../models/rating');
const BusinessCollection = require('../models/buisness');

const ratingOperations = {
    addReview(reviewObj,res){
        RatingCollection.create(reviewObj,(err,doc) => {
            if(err){
                console.log("Error in creating a new entry of rating ",err);
                res.send("Error in creating a new entry of rating");
            }else{
                RatingCollection.find({'store_id' : reviewObj.store_id}, (err,allReviewArr) =>{
                    if(err){
                        console.log("Error in finding reviews related to particular store",err);
                        res.send("Error in finding reviews related to particular store");
                    }else if(doc){
                        let avgRating = 0;
                        for(let i = 0; i < allReviewArr.length; i++){
                            avgRating = avgRating + allReviewArr[i].rating;
                        }
                        avgRating = (avgRating / allReviewArr.length);
                        avgRating = Math.round((avgRating + Number.EPSILON) * 10) / 10
                        let totalReview = allReviewArr.length;
                        BusinessCollection.findOneAndUpdate({"_id" : reviewObj.store_id}, {avgRating:avgRating,totalReview : totalReview},{new : true}, (err,updatedObject) => {
                            if(err){
                                console.log("Error occured while updating the avgRating of a store",err);
                                res.send("Error occured while updating the avgRating of a store");
                            }else{
                                let responseObj = {
                                    msg : "Average rating of a store updated successfully",
                                    obj : updatedObject
                                }
                                res.send(responseObj);
                            }
                        })
                    }else{
                        console.log("No review related to this store");
                        res.send("No response related to this store");
                    }
                })
            }
        })
    },

    //to get all the reviews related to a store
    getReviews(storeId,res){
        RatingCollection.find({"store_id" : storeId}, (err,doc) => {
            if(err){
                console.log("Error in finding the reviews related to a store");
                res.send("Error in finding the reviews related to a store");
            }else{
                let responseObj = {
                    msg : "All the reviews related to a store",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    getLengthOfReviews(storeId,res){
        RatingCollection.find({"store_id" : storeId}, (err,doc) => {
            if(err){
                res.send("Error in finding the length of reviews");
            }else{
                let length = doc.length;
                let responseObj = {
                    msg : "Total reviews related to a particular store",
                    length : length
                }
                res.send(responseObj);
            }
        })
    }
}

module.exports = ratingOperations;