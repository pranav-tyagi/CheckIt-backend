const mongoose = require('../connection');

let Schema = mongoose.Schema;

let EmployeeSchema = new Schema({
    'store_id' : {type : mongoose.Schema.Types.ObjectId, required : true},
    'name' : {type : String},
    'phoneNumber' : {type : String},
    'address' : {type : String},
    'temperature' : {type : Number},
    'imgURL' : {type : String}
})

const EmployeeCollection = mongoose.model('employee',EmployeeSchema);
module.exports = EmployeeCollection;