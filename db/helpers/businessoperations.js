const BusinessCollection = require('../models/buisness');
const UserEntryCollection = require('../models/userentry');
const bcrypt = require('bcrypt');
const jwt = require('../../utils/jwt');

const saltRounds = 10;
const businessOperations = {
    //register a new business
    add(businessObj,res){
        var password = businessObj.password;
        console.log('Password is ',password);
        var hash = bcrypt.hashSync(businessObj.password,saltRounds);
        console.log('Hash password is ',hash);
        businessObj.password = hash;
        let covidCapacity = parseInt(businessObj.capacity / 2);
        console.log(covidCapacity);
        businessObj.covidCapacity = covidCapacity;
        // console.log('Value of businessObj in business operations fun',businessObj);
        BusinessCollection.create(businessObj,(err,obj)=>{
            if(err){
                // res.send('Error during add function');
                res.status(400).send(err);
                console.log('Error during add ',err);
            }
            else{
                // res.send('Record Added Successfully ',obj);
                let responseObj = {
                    message : "Record Added Successfully",
                    obj : obj
                }
                res.status(200).send(responseObj);
            }
        })
    },

    //login a business
    search(businessObj,res){
        BusinessCollection.findOne({'email':businessObj.email},(err,doc) =>{
            if(err){
                console.log('Error During login of employee ',err);
                let responseObj = {
                    msg : "Something Went Wrong during searching in db",
                    obj : err
                }
                res.send(responseObj);
            }
            else if(doc){
                let result = bcrypt.compareSync(businessObj.password,doc.password);
                if(result){
                    var token = jwt.generateToken(doc.email);
                    let responseObj = {
                        isLoggedIn : true,
                        loginObj : doc,
                        token : token
                    }
                    res.send(responseObj);
                }
                else{
                    console.log("Invalid email or password");
                    let responseObj = {
                        isLoggedIn : false,
                        msg : "Invalid email or password"
                    }
                    res.send(responseObj);
                }
            }
            else{
                console.log("User not present in schema");
                let responseObj = {
                    msg : "User not valid"
                }
                res.send(responseObj);
            }
        })
    },
    
    editUserDeatils(editObj,storeId,res){
        BusinessCollection.findOneAndUpdate({"_id" : storeId},editObj,{new : true},(err,doc) => {
            if(err){
                res.send("Error while updating store details");
            }else{
                let responseObj = {
                    msg : "Business detail updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },
    //to show all the active a customer in a shop
    activeCustomers(storeid,res){
        UserEntryCollection.find({"store_id" : storeid, "userStatus" : true},(err,data) => {
            if(err){
                console.log("Error while finding in entry schema");
                res.send("Error while finding in entry schema");
            }else{
                console.log("Data found in the schema");
                res.send(data);
            }
        })
    }
}

module.exports = businessOperations;