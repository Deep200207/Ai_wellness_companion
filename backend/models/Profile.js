import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{type:String,require:true,unique:true},
    age:{type:String,require:true},
    gender:{type:String,require:true},
    height:{type:String,require:true},
    weight:{type:String, require:true},
    picture:{type:String}
})
const Profile=mongoose.model("Profile",userSchema);
export default Profile;