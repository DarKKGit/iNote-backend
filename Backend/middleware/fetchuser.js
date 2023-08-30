const jwt = require('jsonwebtoken');
JWT_SECRET = 'Heil卐Hitler';

const fetchuser = (req,res,next)=>{
    // get the user from the jwt token and add its id to req object
    const token = req.header('auth-token'); // we are getting the token from the header of the request made in thunderclient
    if(!token){
        res.status(401).send({error:'Please Authenticate using a valid token'});
    }

    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error:'Please Authenticate using a valid token'});
    }
}



module.exports = fetchuser;