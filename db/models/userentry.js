const mongoose = require('../connection');

var Schema = mongoose.Schema;

//Schema constructed to keep the count of people in a store
var EntrySchema = new Schema({
    // 'user_id' : {type : mongoose.Schema.Types.ObjectId, ref : 'UserCollection', required : true},
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'name' : {type : String, required : true},
    // 'email' : {type : String, required : true},
    // 'address' : {type : String, required : true},
    'phoneNumber' : {type : String, required : true},
    'temperature' : {type : Number, required : true},
    'aarogyaSetu' : {type : String},
    'entryDate' : {type : String}, 
    // 'entryDate' : {type : Date, default : Date.now()},
    'userStatus' : {type : Boolean, default : true}
})

const UserEntryCollection = mongoose.model('userentry',EntrySchema);
module.exports = UserEntryCollection;