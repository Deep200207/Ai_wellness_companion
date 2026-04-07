import mongoose from "mongoose";

const fitbitTokenSchema=new mongoose.Schema({
    userId:{type : String ,required:true,unique:true},
    fitbitUserId:{type :String},
    accessToken:{type :String ,required:true},
    refreshToken:{type : String ,required:true},
    scope:{type:String },
    tokenType:{type:String},
    expiresIn:{type : Number},
    expiresAt:{type:Number},
},
{
    timestamps:true,
}
);
const FitbitToken=mongoose.model("FitbitToken",fitbitTokenSchema);
export default FitbitToken;