const mongoose = require('../connection');

let Schema = mongoose.Schema;

let InventoryCategorySchema = new Schema({
    'categoryName' : {type : String, required : true},
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true}
})

const InventoryCategoryCollection = mongoose.model('inventorycategory',InventoryCategorySchema);
module.exports = InventoryCategoryCollection;