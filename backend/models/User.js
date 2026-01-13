import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firebaseUid: { type: String, unique: true },
    email:{type:String,required:true,unique:true},
    name:{type:String},
    photoUrl:{type:String},
    password:{type:String}
},
{ timestamps:true}
)
const User=mongoose.model("User",userSchema);
export default User;