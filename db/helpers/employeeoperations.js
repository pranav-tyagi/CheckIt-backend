const EmployeeCollection = require('../models/employee');

const employeeOperations = {
    addEmployee(employeeObj,res){
        EmployeeCollection.create(employeeObj,(err,obj) => {
            if(err){
                console.log("Error in adding a employee");
                res.send("Error in adding a employee");
            }
            else{
                let responseObj = {
                    msg : "Employee created successfully",
                    obj : obj
                }
                res.send(responseObj);
            }
        })
    },

    editEmployee(employeeObj,employeeId,res){
        EmployeeCollection.findOneAndUpdate({"_id" : employeeId}, employeeObj, {new : true}, (err,doc) => {
            if(err){
                console.log("Error in updating employee detail");
                res.send("Error in updating employee detail");
            }
            else{
                let responseObj = {
                    msg : "Employee obj updated successfully",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    },

    deleteEmployee(employeeId,res){
        EmployeeCollection.deleteOne({"_id" : employeeId},(err) => {
            if(err){
                console.log("Error in deleting a particular employee",err);
                res.send("Error in deleting a particular employee");
            }else{
                let responseObj = {
                    msg : "Employee deleted successfully"
                }
                res.send(responseObj);
            }
        })
    },

    getEmployeeDetails(storeId,res){
        EmployeeCollection.find({"store_id" : storeId},(err,doc) => {
            if(err){
                console.log("Error in finding the employee details",err);
                res.send("Error in finding the employee details");
            }else{
                let responseObj = {
                    msg : "All the employee details",
                    obj : doc
                }
                res.send(responseObj);
            }
        })
    }
}

module.exports = employeeOperations;