import mongoose from "mongoose";
const OTPSchema = mongoose.Schema({

    email: {type : String, required : true},
    otp : {type : String, required : true},
    status : {type : Number, default : 0}, // 0 = not verified, 1 = verified
    createdDate : {type : Date, default : Date.now()}
},{versionKey : false});
const OTPSModel = mongoose.model("otps", OTPSchema);
export default OTPSModel;