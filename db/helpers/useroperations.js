const UserCollection = require('../models/user');
const EntryUserCollection = require('../models/userentry');
const BusinessCollection = require('../models/buisness');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const jwt = require('../../utils/jwt');

require('dotenv').config();
const saltRounds = 10;

const userOperations = {
    add(userObj,res){
        console.log('Value of userObj in business operations fun',userObj);
        let hash = bcrypt.hashSync(userObj.password,saltRounds);
        userObj.password = hash;
        UserCollection.create(userObj,(err,obj)=>{
            if(err){
                // res.send('Error during add function');
                res.status(400).send(err);
                console.log('Error during add ',err);
            }
            else{
                // res.send('Record Added Successfully ',obj);
                let responseObj = {
                    message : "Record Of User Added Successfully",
                    obj : obj
                }
                res.status(200).send(responseObj);
            }
        })
    },

    login(userObj,res){
        UserCollection.findOne({'email' : userObj.email},(err,doc) => {
            if(err){
                console.log('Error During login of user ',err);
                let responseObj = {
                    msg : "Something went wrong during searching user ",
                    obj : err
                }
                res.send(responseObj);
            }
            else if(doc){
                let result = bcrypt.compareSync(userObj.password,doc.password);
                if(result){
                    let responseObj = {
                        loginObj : doc,
                        isLoggedIn : true
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

    getParticularUser(userId,res){
        UserCollection.findOne({"_id" : userId},(err,doc) => {
            if(err){
                console.log("Error while finding a particular user ",err);
                res.send("Error while finding a particular user");
            }else{
                let responseObj = {
                    msg : "The data of user ",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    // searchForEntry(userObj,res){
    //     UserCollection.findOne({'email' : userObj.email},(err,doc)=>{
    //         if(err){
    //             console.log("Error occured while finding in database",err);
    //             res.send("Error occured while finding in database");
    //         }
    //         else if(doc){
    //             let searchObj = doc;
    //             console.log("Object after searching it from db ",searchObj);
    //             userObj.user_id = searchObj._id;
    //             userObj.name = searchObj.name;
    //             userObj.address = searchObj.address;
    //             userObj.phoneNumber = searchObj.phoneNumber;
    //             BusinessCollection.findOne({"_id" : userObj.store_id}, (err,doc) => {
    //                 if(err){
    //                     console.log("Error occured while finding the particular store for increasing available seats",err);
    //                     res.send("Error occured while finding the particular store for increasing available seats");
    //                 }
    //                 else{
    //                     if(doc.occupied < doc.covidCapacity){
    //                         doc.occupied = doc.occupied + 1;
    //                         BusinessCollection.updateOne({"_id" : doc._id}, {$set : {occupied : doc.occupied}},(err) => {
    //                             if(err){
    //                                 console.log("Error occured while updating the count of occupied seats in business collection",err);
    //                                 res.send("Error occured while updating the count of occupied seats in business collection");
    //                             }else{
    //                                 console.log("Business collection updated successfully for occupied seats");
    //                                 EntryUserCollection.create(userObj,(err,obj) =>{
    //                                     if(err){
    //                                         console.log("Error occured while adding the data ",err);
    //                                         res.send("Error while adding the data");
    //                                     }else{
    //                                         let responseObj = {
    //                                             message : "Entry Record Added successfully",
    //                                             objectAddedCheck : true,
    //                                             obj : obj
    //                                         }
    //                                         res.send(responseObj);
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     }
    //                     else if(doc.occupied == doc.covidCapacity){
    //                         console.log("Please wait for a customer to leave the place");
    //                         let responseObj = {
    //                             objectAddedCheck : false,
    //                             msg : "Please wait for a customer to leave the place"
    //                         }
    //                         res.send(responseObj);
    //                     }
    //                 }
    //             })
    //         }
    //         else{
    //             console.log("The user is not registered");
    //             let responseObj = {
    //                 msg : "The user is not registered"
    //             }
    //             res.send(responseObj);
    //         }
    //     })
    // },

    addUserEntry(userObj,res){
        // userOperations.searchForEntry(userObj,res);
        console.log(userObj);
        BusinessCollection.findOne({"_id" : userObj.store_id}, (err,doc) => {
            if(err){
                console.log("Error occured while finding the particular store for increasing available seats",err);
                res.send("Error occured while finding the particular store for increasing available seats");
            }
            else if(doc){
                if(doc.occupied < doc.covidCapacity){
                    doc.occupied = doc.occupied + 1;
                    BusinessCollection.updateOne({"_id" : doc._id}, {$set : {occupied : doc.occupied}}, (err) =>{
                        if(err){
                            console.log("Error occured while updating the count of occupied seats in business collection",err);
                            res.send("Error occured while updating the count of occupied seats in business collection");
                        }else{
                            let date = new Date();
                            userObj.entryDate = date.toLocaleDateString();
                            EntryUserCollection.create(userObj,(err,obj) => {
                                if(err){
                                    console.log("Error occured while adding the data ",err);
                                    res.send("Error while adding the data");
                                }else{
                                    let responseObj = {
                                        message : "Entry Record Added successfully",
                                        objectAddedCheck : true,
                                        obj : obj
                                    }
                                    res.send(responseObj);
                                }
                            })
                        }
                    })
                }
                else if(doc.occupied == doc.covidCapacity){
                    console.log("Please wait for a customer to leave the place");
                    let responseObj = {
                        objectAddedCheck : false,
                        msg : "Please wait for a customer to leave the place"
                    }
                    res.send(responseObj);
                }
            }
            else {
                res.send("No such store is available");
            }
        })
    },

    editUserEntry(userObj,userId,res){
        EntryUserCollection.findOneAndUpdate({"_id" : userId}, userObj,{new : true}, (err,doc) => {
            if(err){
                console.log("Error while updating the user entry ",err);
                res.send("Error while updating the user entry");
            }else{
                let responseObj = {
                    msg : "User entry updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    deleteUserEntry(userId,res){
        EntryUserCollection.findOne({"_id" : userId},(err,doc) => {
            if(err){
                console.log("Error while deleting a user entry",err);
                res.send("Error while deleting a user entry");
            }else if(doc){
                BusinessCollection.findOne({"_id" : doc.store_id},(err,businessDoc) => {
                    if(err){
                        console.log("Error while finding the business detail",err);
                        res.send("Error while finding the business detail");
                    }else{
                        businessDoc.occupied = businessDoc.occupied - 1;
                        BusinessCollection.updateOne({"_id" : businessDoc._id},{$set : {occupied : businessDoc.occupied}},(err) => {
                            if(err){
                                console.log("Error occured while updating the occuiped seats",err);
                                res.send("Error occured while updating the occuiped seats");
                            }else{
                                console.log("Occupied seats decreased successfully");
                                EntryUserCollection.deleteOne({"_id" : userId},(err) => {
                                    if(err){
                                        console.log("Error while deleting a user entry",err);
                                        res.send("Error while deleting a user entry");
                                    }else{
                                        let responseObj = {
                                            msg : "User entry deleted successfully"
                                        }
                                        res.send(responseObj);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    updateUserEntry(entryid,updatedFields,res){
        console.log(entryid, updatedFields);
        EntryUserCollection.findOne({"_id" : entryid}, (err,doc) => {
            if(err){
                console.log("Error while finding the entry schema",err);
                res.send("Error while finding in entry schema");
            }
            else if(doc){
                const output=`
                <h5>Hello from our covid app</h5>
                <h5>Please Rate us</h5>
                <a href = "http://localhost:4200/review/storeId/userId">Rate us</a>
                <h5> The url for api call will be http://localhost:8080/user/addreview</h5>
                `;
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, 
                    auth: {
                      user: process.env.MAILING_ID, // generated ethereal user
                      pass: process.env.MAILING_PASSWORD // generated ethereal password
                    }
                  });
                
                  // send mail with defined transport object
                  let info =  transporter.sendMail({
                    from: '"Check It" maniksingh035@gmail.com', // sender address
                    to: "maniksingh99@gmail.com", // list of receivers
                    subject: "Please review us", // Subject line
                    text: "Hello world?", // plain text body
                    html: output // html body
                  });
                
            
                BusinessCollection.findOne({"_id" : doc.store_id},(err,businessDoc) =>{
                    if(err){
                        console.log("Error while finding the business doc to decrease the occupied seats ",err);
                        res.send("Error while finding the business doc to decrease the occupied seats");
                    }
                    else{
                        businessDoc.occupied = businessDoc.occupied - 1;
                        BusinessCollection.updateOne({"_id" : businessDoc._id},{$set : {occupied : businessDoc.occupied}}, (err) => {
                            if(err){
                                console.log("Error occured while updating the occuiped seats",err);
                                res.send("Error occured while updating the occuiped seats");
                            }else{
                                console.log("Occupied seats decreased successfully");
                                EntryUserCollection.updateOne({"_id" : entryid}, {$set : {userStatus : updatedFields.userStatus}}, (err,obj) => {
                                    if(err){
                                        console.log("Error while updating the fields ",err);
                                        res.send("Error while updating the fields");
                                    }
                                    else{
                                        let responseObj = {
                                            msg : "Fields updated successfully",
                                            obj : obj
                                        }
                                        console.log("Object updated successfully",responseObj);
                                        res.send(responseObj);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        
    },

    getAllStores(res){
        BusinessCollection.find({},(err,doc) => {
            if(err){
                console.log("Error in finding all the stores ",err);
                res.send("Error in finding all the stores");
            }else if(doc){
                console.log("Successfully found all the stores");
                console.log(doc);
                let responseArr = [];
                for(let i = 0; i < doc.length; i++){
                    let obj = {};
                    obj.covidCapacity = doc[i].covidCapacity;
                    obj.occupied = doc[i].occupied;
                    obj.type = doc[i].type;
                    obj.ownername = doc[i].ownername;
                    obj.address = doc[i].address;
                    obj.city = doc[i].city;
                    obj.state = doc[i].state;
                    obj.organizationDesc = doc[i].organizationDesc;
                    obj.organizationCovidDesc = doc[i].organizationCovidDesc;
                    obj.organizationName = doc[i].organizationName;
                    obj._id = doc[i]._id;
                    obj.avgRating = doc[i].avgRating;
                    obj.safetyKit = doc[i].safetyKit;
                    obj.temperatureCheck = doc[i].temperatureCheck;
                    obj.sanitization = doc[i].sanitization;
                    obj.socialDistancingCheck = doc[i].socialDistancingCheck;
                    obj.images = doc[i].images;
                    obj.totalReview = doc[i].totalReview;
                    responseArr.push(obj);
                }
                let responseObj = {
                    msg : "Successfully found all the stores",
                    responseArr : responseArr
                }
                res.send(responseObj);
            }
        })
    },

    getParticularStore(storeId,res){
        BusinessCollection.findOne({"_id" : storeId}, (err,doc) => {
            if(err){
                console.log("Error in finding a particular store ",err);
                res.send("Error in finding a particular store");
            }else{
                console.log("Successfully found the particular store");
                let obj = {};
                console.log(doc);
                obj.covidCapacity = doc.covidCapacity;
                obj.occupied = doc.occupied;
                obj.type = doc.type;
                obj.ownername = doc.ownername;
                obj.address = doc.address;
                obj.city = doc.city;
                obj.state = doc.state;
                obj.organizationDesc = doc.organizationDesc;
                obj.organizationCovidDesc = doc.organizationCovidDesc;
                obj.organizationName = doc.organizationName;
                obj._id = doc._id;
                obj.avgRating = doc.avgRating;
                obj.safetyKit = doc.safetyKit;
                obj.temperatureCheck = doc.temperatureCheck;
                obj.sanitization = doc.sanitization;
                obj.socialDistancingCheck = doc.socialDistancingCheck;
                obj.images = doc.images;
                obj.totalReview = doc.totalReview;
                console.log(obj);
                let responseObj = {
                    msg : "Successfully found the particular store",
                    obj : obj
                }
                res.send(responseObj);
            }
        })
    },

    getCurrentDateVist(storeId,res){
        let date = new Date();
        let entryDate = date.toLocaleDateString();
        EntryUserCollection.find({"store_id" : storeId, "entryDate" : entryDate},(err,doc) =>{
            if(err){
                res.send("Error in sending the daily store visit count");
            }else{
                let length = doc.length;
                let responseObj = {
                    msg : "The daily visit count to a particular store",
                    length : length
                }
                res.send(responseObj);
            }
        })
    }
}

module.exports = userOperations;
