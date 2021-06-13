const OrderCollection = require('../models/order');
const UserCollection = require('../models/user');

const orderOperations = {
    addOrder(orderObj,res){
        UserCollection.findOne({"_id" : orderObj.user_id}, (err,doc) => {
            if(err){
                console.log("Error in finding the user in addOrder function",err);
                res.send("Error in finding the user in addOrder function");
            }else{
                let order = {};
                order = {...orderObj};
                order.orderedItems = doc.cart;
                order.totalCost = doc.totalCost;
                order.totalQty = doc.totalQty;
                order.customerName = doc.name;
                order.customerNumber = doc.phoneNumber;
                let date = new Date();
                order.orderDate = date.toLocaleDateString();
                doc.cart = [];
                doc.totalCost = 0;
                doc.totalQty = 0;
                let userObj = doc;
                UserCollection.findOneAndUpdate({"_id" : orderObj.user_id}, userObj, {new : true}, (err,updatedObj) =>{
                    if(err){
                        console.log("Error in updating user details",err);
                    }else{
                        console.log("The user details are updated successfully",updatedObj);
                        OrderCollection.create(order,(err,doc) => {
                            if(err){
                                console.log("Error occured while adding order ",err);
                                res.send("Error occured while adding order");
                            }else{

                                // eventEmitter.emit('newOrder',doc);
                                let responseObj = {
                                    msg : "Order successfully placed",
                                    obj : doc
                                }
                                res.send(responseObj);
                            }
                        })
                    }
                })
                
            }
        })
    },

    editOrder(orderObj,orderId,res){
        OrderCollection.findOneAndUpdate({"_id" : orderId}, orderObj, {new : true}, (err,doc) => {
            if(err){
                res.send("Error in updating the order status");
            }else{

                //using emitter here for updatingg status of order
                // eventEmitter.emit('orderUpdated',{id : orderId,status : orderObj.status})
                let responseObj = {
                    msg : "Order status updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    // To get order history of users
    getAllUserOrder(userId,res){
        OrderCollection.find({"user_id" : userId} ,(err,doc) => {
            if(err) { 
                console.log("Error in finding the orders realted to a user",err);
                res.send("Error in finding the orders realted to a user");
            }else {
                let responseObj = {
                    msg : "All the orders of the particular user",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    //get all the order for store
    getAllStoreOrder(storeId,res){
        OrderCollection.find({"store_id" : storeId}, (err,doc) => {
            if(err){
                console.log("Error while finding the orders by for a particular store ",err);
                res.send("Error while finding the orders by for a particular store");
            }else{
                let responseObj = {
                    msg : "All the orders related to a particular store",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    getAllOrderByCurrentDate(storeId,res){
        let date = new Date();
        let currentDate = date.toLocaleDateString();
        console.log(currentDate);
        OrderCollection.find({"store_id" : storeId, "orderDate" : currentDate},(err,doc) =>{
            if(err){
                console.log("Error while finding the orders by current date",err);
                res.send("Error while finding the orders by current date");
            }else{
                let responseObj = {
                    msg : "All the orders related to particular store according to current date",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    getAllOrderByCurrentDateLength(storeId,res){
        let date = new Date();
        let currentDate = date.toLocaleDateString();
        console.log(currentDate);
        OrderCollection.find({"store_id" : storeId, "orderDate" : currentDate},(err,doc) =>{
            if(err){
                console.log("Error while finding the orders by current date",err);
                res.send("Error while finding the orders by current date");
            }else{
                let length = doc.length;
                let responseObj = {
                    msg : "All the orders related to particular store according to current date",
                    length : length
                }
                res.send(responseObj);
            }
        })
    },

    getAllOrderOfCurrentMonth(storeId,res){
        let date = new Date();
        let currMonth = date.getMonth() + 1;
        let currYear = date.getFullYear();
        console.log("value of month and year ",currMonth, " ", currYear);
        OrderCollection.find({"store_id" : storeId},(err,doc) => {
            if(err){
                console.log("Error while finding the current month data",err);
                res.send("Error while finding the current month data");
            }else{
                let length = 0;
                let arr = [];
                for(let i = 0; i < doc.length; i++){
                    let parts = doc[i].orderDate.split('/');
                    let month = parts[0];
                    let year = parts[2];
                    if(currYear = year && currMonth == month){
                        arr.push(doc[i]);
                        length = length + 1;
                    }
                }
                let responseObj = {
                    msg : "All the current month orders",
                    length : length,
                    obj : arr
                }
                res.send(responseObj);
            }
        })
    },

    getOrderById(orderId,res){
        OrderCollection.findOne({"_id" : orderId}, (err,doc) => {
            if(err){
                console.log("Error while finding the order by id ",err);
                res.send("Error while finding the order by id");
            }else{
                let responseObj = {
                    msg : "Particular order by id",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    addItemToCart(userId,item,res){
        UserCollection.findOne({"_id" : userId}, (err,doc) => {
            if(err){
                console.log("Error in finding the user ",err);
                res.send("Error in finding the user");
            }else if(doc){
                
                // let cart = [];
                if(doc == null){
                    res.send("Cart is null");
                }
                console.log("User whose cart is to be updated is found",doc);
                console.log("Value of array ",doc.cart);
                
                // cart = doc.cart;
                if(doc.cart.length == 0){
                    item.qty = 1;
                    doc.cart.push(item);
                    doc.totalCost = doc.totalCost + item.price;
                }else{
                    let index = doc.cart.findIndex(ele => ele._id == item._id);
                    if(index == -1){
                        item.qty = 1;
                        doc.totalCost = doc.totalCost + item.price;
                        doc.cart.push(item);
                    }else{
                        let itemObj = doc.cart[index];
                        itemObj.qty = itemObj.qty + 1;
                        doc.cart[index] = itemObj;

                        doc.totalCost = doc.totalCost + item.price; 
                    }
                }
                doc.totalQty = doc.totalQty + 1 ;
                // console.log(cart);
                // doc.cart = cart;
                let userObj = doc;
                UserCollection.findOneAndUpdate({"_id" : userId}, userObj, {new : true}, (err,updatedObj) => {
                    if(err){
                        console.log("Error while updating the user collection",err);
                        res.send("Error while updating the user collection");
                    }else{
                        let responseObj = {
                            msg : "Object added to cart successfully",
                            obj : updatedObj
                        }
                        res.send(responseObj);
                    }
                })
            }else{
                res.send("No user found");
            }
        })
    },

    subItemFromCart(userId,item,res){
        UserCollection.findOne({"_id" : userId},(err,doc) => {
            if(err){
                console.log("Error in finding the user in subtract function ",err);
                res.send("Error in finding the user in subtract function");
            }else if(doc){
                // let cart = doc.cart;
                if(doc == null){
                    res.send("Cart is null");
                }
                let index = doc.cart.findIndex((ele) => ele._id == item._id);
                let itemObj = doc.cart[index];
                itemObj.qty = itemObj.qty - 1;
                doc.cart[index] = itemObj;
                doc.totalCost = doc.totalCost - item.price;
                
                if(doc.cart[index].qty == 0){
                    doc.cart.splice(index,1);
                }
                doc.totalQty = doc.totalQty - 1;
                // doc.cart = cart;
                let userObj = doc;
                UserCollection.findOneAndUpdate({"_id" : userId}, userObj, {new : true}, (err,updatedObj) => {
                    if(err){
                        console.log("Error while updating the user cart in minus function",err);
                        res.send("Error while updating the user cart in minus function");
                    }else{
                        let responseObj = {
                            msg : "Cart updated successfully while subtraction",
                            obj : updatedObj
                        }
                        res.send(responseObj);
                    }
                })
            }else{
                res.send("No user found");
            }

        })
    },

    getCartBeforePlacing(userId,res){
        UserCollection.findOne({"_id" : userId},(err,doc) => {
            if(err){
                console.log("Error while finding the user cart",err);
                res.send("Error while finding the user cart");
            }else{
                let responseObj = {
                    cart : doc.cart,
                    totatCost : doc.totalCost,
                    totalQty : doc.totalQty
                }
                res.send(responseObj);
            }
        })
    },

    getCustomerById(customerId,res){
        UserCollection.findOne({"_id" : customerId},(err,doc) => {
            if(err){
                console.log("Error in finding customer for a particular order ",err);
                res.send("Error in finding customer for a particular order");
            }else{
                let responseObj = {
                    msg : "The customer for a particular order",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    }
    // getAllOrderByCurrentDate(storeId,res){
        
    //     OrderCollection.find({"store_id" : storeId, "orderDate" : {$gte: new Date(new Date().setHours(00, 00, 00)), $lt: new Date(new Date().setHours(23, 59, 59))}},(err,doc) => {
    //         if(err){
    //             console.log("Error while finding the orders by current date",err);
    //             res.send("Error while finding the orders by current date");
    //         }else{
    //             let responseObj = {
    //                 msg : "All the orders related to particular store according to current date",
    //                 obj : doc
    //             }
    //             res.send(responseObj);
    //         }
    //     })
    // },
}

module.exports = orderOperations;