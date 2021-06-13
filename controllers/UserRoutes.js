const express = require('express');
const JWTMiddleware = require('../utils/jwtmiddleware');
const userOperations = require('../db/helpers/useroperations');
const employeeOperations = require('../db/helpers/employeeoperations');
const route = express.Router();
const orderOperations = require('../db/helpers/orderoperations');
const ratingOperations = require('../db/helpers/ratingoperations');

// route.post('/register',(req,res) => {
//     var userObj = req.body;
//     console.log("Controller object printing",userObj);
//     const businessOperations = require('../db/helpers/useroperations');
//     businessOperations.add(userObj,res);
// })

//registering a user
route.post('/register',(req,res) => {
    userOperations.add(req.body,res);
})

//user login
route.post('/login', (req,res) => {
    userOperations.login(req.body,res);
})

route.get('/getparticularuser/:userId',(req,res) => {
    let userId = req.params.userId;
    userOperations.getParticularUser(userId,res);
})

route.post('/userentry',JWTMiddleware,(req,res) => {
    var userObj =req.body;
    const userOperations = require('../db/helpers/useroperations');
    userOperations.addUserEntry(userObj,res);
})

//to change the status of the user 
route.put('/userentry/:entryid',JWTMiddleware,(req,res) => {
    // console.log(req.params);
    let entryid = req.params.entryid;
    let updatedFields = req.body;
    console.log(entryid);
    console.log(updatedFields);
    const userOperations = require('../db/helpers/useroperations');
    userOperations.updateUserEntry(entryid,updatedFields,res);
})

//to get all the stores for user landing page
route.get('/getallstores',(req,res) => {
    const userOperations = require('../db/helpers/useroperations');
    userOperations.getAllStores(res);
})

//to get a particular store at user landing page
route.get('/getstore/:id',(req,res) => {
    let storeId = req.params.id;
    console.log(storeId);
    const userOperations = require('../db/helpers/useroperations');
    userOperations.getParticularStore(storeId,res);
})

//a user can add review
route.post('/addreview',(req,res) => {
    let reviewObj = req.body;
    console.log(reviewObj);
    const ratingOperations = require('../db/helpers/ratingoperations');
    ratingOperations.addReview(reviewObj,res);
})

route.get('/getreview/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    ratingOperations.getReviews(storeId,res);
})

//route to place a order
route.post('/order',(req,res) => {
    let orderObj = req.body;
    // const eventEmitter = req.app.get('eventEmitter');
    orderOperations.addOrder(orderObj,res);
})

//route to add item in cart
route.put('/additem/:userid',(req,res) => {
    let addItem = req.body;
    let userId = req.params.userid;
    orderOperations.addItemToCart(userId,addItem,res);
})

//route to sub item in cart
route.put('/subitem/:userid',(req,res) => {
    let subItem = req.body;
    let userId = req.params.userid;
    orderOperations.subItemFromCart(userId,subItem,res);
})

//get route to get order before getting placed
route.get('/getcart/:userid',(req,res) => {
    let userId = req.params.userid;
    orderOperations.getCartBeforePlacing(userId,res);
})

//to get all the pervious order of user
route.get('/order/:userid',(req,res) => {
    let userId = req.params.userid;
    orderOperations.getAllUserOrder(userId,res);
})

//to get a particular order of user
route.get('/orderbyid/:orderId', (req,res) => {
    let orderId = req.params.orderId;
    orderOperations.getOrderById(orderId,res);
})

route.get('/employee/:employeeid',(req,res) => {
    let employeeId = req.params.employeeid;
    employeeOperations.getEmployeeDetails(employeeId,res);
})

module.exports = route