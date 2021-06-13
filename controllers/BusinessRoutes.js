const express = require('express');
const JWTMiddleware = require('../utils/jwtmiddleware');
const businessOperations = require('../db/helpers/businessoperations');
const inventoryOperations = require('../db/helpers/inventoryoperations');
const orderOperations = require('../db/helpers/orderoperations');
const employeeOperations = require('../db/helpers/employeeoperations');
const ratingOperations = require('../db/helpers/ratingoperations');
const userOperations = require('../db/helpers/useroperations');
const route = express.Router();

route.post('/register',(req,res) => {
    let businessObj = req.body;
    console.log("Controller object printing",businessObj);
    businessOperations.add(businessObj,res);
})

route.put('/editdetails/:storeId',(req,res) => {
    let editObj = req.body;
    let storeId = req.params.storeId;
    businessOperations.editUserDeatils(editObj,storeId,res);
})

route.post('/login',(req,res)=>{
    let loginObj = req.body;
    businessOperations.search(loginObj,res);
})

//to get the active customers of a store at organization dashboard
route.get('/activecustomers/:storeid',JWTMiddleware,(req,res) => {
    let storeid = req.params.storeid;
    businessOperations.activeCustomers(storeid,res);
})

route.post('/category',(req,res) => {
    let categoryObj = req.body;
    inventoryOperations.addCategory(categoryObj,res);
})

route.delete('/category/:deleteid',(req,res) => {
    let deleteId = req.params.deleteid;
    inventoryOperations.deleteCategory(deleteId,res);
})

route.put('/category',(req,res) => {
    let updateObj = req.body;
    inventoryOperations.updateCategory(updateObj,res);
})

route.post('/item',(req,res) => {
    let itemObj = req.body;
    inventoryOperations.addItem(itemObj,res);
})

route.delete('/item/:deleteid',(req,res) => {
    let deleteId = req.params.deleteid;
    inventoryOperations.deleteItem(deleteId,res);
})

route.put('/item', (req,res) => {
    let updateObj = req.body;
    inventoryOperations.updateItem(updateObj,res);
})

route.get('/item/:storeid',(req,res) => {
    let storeId = req.params.storeid;
    inventoryOperations.getAllCategoryItems(storeId,res);
})

//to get all the pervious order of store
route.get('/order/:storeid',(req,res) => {
    let storeId = req.params.storeid;
    orderOperations.getAllStoreOrder(storeId,res);
})

//api to edit order
route.put('/order/:orderId',(req,res) => {
    let orderId = req.params.orderId;
    let orderObj = req.body;
    // const eventEmitter = req.app.get('eventEmitter');
    orderOperations.editOrder(orderObj,orderId,res);
})

//to get all orders of present date to store
route.get('/orderbydate/:storeid',(req,res) => {
    let storeId = req.params.storeid;
    orderOperations.getAllOrderByCurrentDate(storeId,res);
})

//to get a particular order
route.get('/orderbyid/:orderId',(req,res) => {
    let orderId = req.params.orderId;
    orderOperations.getOrderById(orderId,res);
})

route.post('/employee',(req,res) => {
    let employeeObj = req.body;
    employeeOperations.addEmployee(employeeObj,res);
})

route.get('/employee/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    employeeOperations.getEmployeeDetails(storeId,res);
})

route.put('/employee/:employeeid',(req,res) => {
    let employeeId = req.params.employeeid;
    let employeeObj = req.body;
    employeeOperations.editEmployee(employeeObj,employeeId,res);
})

route.delete('/employee/:employeeId', (req,res) => {
    let employeeId = req.params.employeeId;
    employeeOperations.deleteEmployee(employeeId,res);
})

route.get('/getordercustomer/:customerId',(req,res) => {
    let customerId = req.params.customerId;
    orderOperations.getCustomerById(customerId,res);
})

route.get('/totalreviews/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    ratingOperations.getLengthOfReviews(storeId,res);
})

route.get('/getordercurrentdatelength/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    orderOperations.getAllOrderByCurrentDateLength(storeId,res);
})

route.get('/getdailyvisitcount/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    userOperations.getCurrentDateVist(storeId,res);
})

route.get('/getmonthordercount/:storeId',(req,res) => {
    let storeId = req.params.storeId;
    orderOperations.getAllOrderOfCurrentMonth(storeId,res);
})

route.put('/edituser/:userId',(req,res) => {
    let userId = req.params.userId;
    let userObj = req.body;
    userOperations.editUserEntry(userObj,userId,res);
})

route.delete('/deleteentry/:userId',(req,res) => {
    let userId = req.params.userId;
    userOperations.deleteUserEntry(userId,res);
})


module.exports = route;