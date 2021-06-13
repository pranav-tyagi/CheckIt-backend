const jwt = require('../utils/jwt');

const JWTMiddleware = (req,res,next) => {
    const bearerHeader = req.headers['authorization'];
    console.log("value of bearer header object ",bearerHeader);
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        var userEmail = jwt.verifyToken(bearerToken);
        console.log("Hello ...... ",userEmail);
        if(userEmail) {
            console.log('Token is authenticated');
            next();
        }
        else{
            res.send({msg : "Invalid token"});
        }
    }else{
        res.send({msg : "Headers not attached"});
    }
}

module.exports = JWTMiddleware;