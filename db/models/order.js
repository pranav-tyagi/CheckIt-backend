const mongoose = require('../connection');

let Schema = mongoose.Schema;

let OrderSchema = new Schema({
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'user_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'orderedItems' : {type : Array},
    'status' : {type: String,default : "pending"},
    'totalCost' : {type : Number, required :true},
    'totalQty' : {type : Number, required : true},
    'customerName' : {type : String},
    'customerNumber' : {type : String},
    'storeName' : {type : String},
    'orderDate' : {type : String}
    // 'orderDate' : {type : Date, default : Date.now()}
})

const OrderCollection = mongoose.model('order',OrderSchema);
module.exports = OrderCollection;