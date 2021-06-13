const mongoose = require('../connection');

var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'user_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'name' : {type : String, required : true},
    'comment' : {type : String, required : true},
    'rating' : {type : Number, required : true}
})

const RatingCollection = mongoose.model('rating',RatingSchema);
module.exports = RatingCollection;