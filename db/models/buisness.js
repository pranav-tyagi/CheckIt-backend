const mongoose = require('../connection');

var Schema = mongoose.Schema;

var BusinessSchema = new Schema({
    'ownername' : {type:String,required:true},
    'password':{type:String,required:true},
    'organizationName' : {type:String,required:true},
    'phoneNumber' : {type:String, required : true},
    'email' : {type : String,required:true,unique:true},
    'capacity':{type:Number,required:true},
    'covidCapacity' : {type:Number},
    'type':{type:String,required:true},
    'occupied' : {type:Number , default : 0},//number of people in a shop
    'organizationDesc' : {type : String},
    'organizationCovidDesc' : {type : String},
    //Second phase
    'state' : {type : String, required : true},
    'city' : {type : String, required : true},
    'address' : {type : String, required : true},
    'pincode' : {type : Number, require : true},
    // 'vaccinatedEmployees' : {type : Number,required:true},
    'safetyKit' : {type : Boolean, required : true},
    'temperatureCheck' : {type:Boolean,required:true},
    'sanitization' : {type:Boolean,required:true},
    'socialDistancingCheck' : {type:Boolean,required:true},
    'averageRating' : {type : Number},
    'createdAt' : {type : Date, default : Date.now()},
    'updatedAt' : {type : Date, default : Date.now()},
    'avgRating' : {type : Number, default : 0},
    'images' : {type : Array},
    'totalReview' : {type : Number,default : 0}
})

const BusinessCollection = mongoose.model('business',BusinessSchema);
module.exports = BusinessCollection;