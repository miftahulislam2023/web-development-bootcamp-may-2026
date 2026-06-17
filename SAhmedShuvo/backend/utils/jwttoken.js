const jwt = require("jsonwebtoken");
const moment = require("moment");
const generateToken= async (userId, expires, type, secret=process.env.JWT_SECRET)=>
{
    const payload={
        sub: userId,
        iat: moment().unix(), // initiated at
        exp: expires.unix(),
        type,
    };

    return jwt.sign(payload, secret);
}
module.exports= {generateToken};