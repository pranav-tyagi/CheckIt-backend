const InventoryItemCollection = require('../models/inventoryitem');
const InventoryCategoryCollection = require('../models/inventorycategory');
const { response } = require('express');

const inventoryOperations = {
    
    addCategory(categoryObj,res){
        InventoryCategoryCollection.create(categoryObj,(err,obj) => {
            if(err){
                res.send("Error while adding item category in table");
            }else{
                let responseObj = {
                    msg : "Item Category added successfully",
                    obj : obj
                }
                res.send(responseObj);
            }
        })
    },

    deleteCategory(deleteId,res){
        InventoryItemCollection.deleteMany({"category_id" : deleteId},(err,obj) => {
            if(err){
                res.send("Error while deleting the items of particular category");
            }else{
                InventoryCategoryCollection.deleteOne({"_id" : deleteId},(err,obj) =>{
                    if(err){
                        res.send("Error while deleting category");
                    }else{
                        let responseObj = {
                            msg : "The category and its item are deleted successfully",
                            obj : obj
                        }
                        res.send(responseObj);
                    }
                })
            }
        })
    },

    updateCategory(updateObj,res){
        InventoryCategoryCollection.findOneAndUpdate({"_id" : updateObj._id}, updateObj, {new : true}, (err,doc) => {
            if(err){
                res.send("Error while updating the category name");
            }else{
                let responseObj = {
                    msg : "Category Name updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    addItem(itemObj,res){
        InventoryItemCollection.create(itemObj,(err,obj) => {
            if(err){
                res.send("Error while adding the item in table");
            }else{
                let responseObj = {
                    msg : "Item added successfully",
                    obj : obj
                }
                res.send(responseObj);
            }
        })
    },

    deleteItem(deleteId,res){
        InventoryItemCollection.deleteOne({"_id" : deleteId},(err) => {
            if(err){
                res.send("Error while deleting the item");
            }else{
                let responseObj = {
                    msg : "Item deleted Successfully",
                }
                res.send(responseObj);
            }
        })
    },

    updateItem(updateObj,res){
        InventoryItemCollection.findOneAndUpdate({"_id" : updateObj._id}, updateObj, {new : true}, (err,doc) =>{
            if(err){
                res.send("Error while updating the item");
            }else{
                let responseObj = {
                    msg : "Item updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    //to get all the items category wise for a particular store
    getAllCategoryItems(storeId,res){
        InventoryCategoryCollection.find({"store_id" : storeId},async (err,categoryArr) => {
            if(err){
                res.send("Error in finding store specific categories");
            }else{
                await InventoryItemCollection.find({"store_id" : storeId}, (err,itemList) => {
                    if(err){
                        res.send("Error in finding the items related to a store ");
                    }else{
                        let categoryItems = [];
                        // console.log(itemList);
                        // console.log(categoryArr);
                        for(let  i = 0; i < categoryArr.length; i++){
                            let itemArr = [];
                            for(let j = 0; j < itemList.length; j++){
                                // console.log(categoryArr[i]._id.equals(itemList[j].category_id));
                                if(categoryArr[i]._id.equals(itemList[j].category_id)){
                                    itemArr.push(itemList[j]);
                                }
                            }
                            // console.log(itemArr);
                            let categoryObj = {};
                            categoryObj.categoryName = categoryArr[i].categoryName;
                            categoryObj.id = categoryArr[i]._id;
                            categoryObj.itemArr = itemArr;
                            categoryItems.push(categoryObj);
                        }
                        let responseObj = {
                            msg : "Category wise items fetched",
                            categoryItems : categoryItems
                        }
                        res.send(responseObj);
                    }
                })
            }
        })
    },

}

module.exports = inventoryOperations;