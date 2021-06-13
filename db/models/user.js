const mongoose = require('../connection');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    'name' : {type:String,required:true},
    'email' : {type:String,required:true,unique:true},
    'password' : {type : String, required : true},
    // 'address' : {type:String,required:true},
    'phoneNumber' : {type:String,required:true},
    'cart' : {type : Array},
    'totalCost' : {type : Number,default : 0},
    'totalQty' : {type : Number, default : 0}
})

const UserCollection = mongoose.model('users',UserSchema);
module.exports = UserCollection;