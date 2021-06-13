const mongoose = require('../connection');

let Schema = mongoose.Schema;

let InventoryItemSchema = new Schema({
    'productName' : {type : String, required : true},
    'price' : {type : Number, required : true},
    // 'quantity' : {type : Number, required : true},
    'inStock' : {type : Boolean, default : true},
    'imgUrl' : {type : String},
    'category_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
})

const InventoryItemCollection = mongoose.model('inventoryitem',InventoryItemSchema);
module.exports = InventoryItemCollection;