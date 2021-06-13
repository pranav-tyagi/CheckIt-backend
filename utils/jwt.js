const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtOperations = {
    SECRETKEY : process.env.JWT_SECRETKEY,
    generateToken(userEmail){
        var token = jwt.sign({userEmail},this.SECRETKEY,{expiresIn : '1h'});
        return token;
    },
    verifyToken(clientTokenNumber){
        console.log('verify token invoked');
        let decoded = jwt.verify(clientTokenNumber,this.SECRETKEY);
        console.log(decoded);
        if(decoded){
            console.log('Decoded is ', decoded);
            console.log('verifed ',decoded.userEmail);
            return decoded.userEmail;
        }else{
            console.log('Token not matched');
            return undefined;
        }
        // jwt.verify(clientTokenNumber,this.SECRETKEY,(err,decoded) => {
        //     if(err){
        //         console.log('Token not matched...');
        //         return undefined;
        //     }else{
        //         console.log('Decoded is ', decoded);
        //         console.log('verifed ',decoded.userEmail);
        //         // return decoded.userEmail;
        //         return "Hello";
        //     }
        // });
        
    }
}

module.exports = jwtOperations;