import express from "express";

import admin from "../firebaseAdmin.js";
import User from "../models/User.js";

const firebaseGoogleRouter=express.Router();

firebaseGoogleRouter.post("/auth/firebase/google",async (req,res)=>{
  try{
    const {idToken}=req.body;
    if(!idToken) {return res.status(400).json({error:"Id Token is missing"})}
    const decode= await admin.auth().verifyIdToken(idToken);
    console.log("Decode Token",decode);
    const {uid,email,name,picture}=decode;

    let user=await User.findOne({firebaseUid:uid});
    if(!user){
      user=await User.create({
        firebaseUid:uid,
        email,
        name:name || "",
        photoUrl:picture || "",
      });
    }
    else{
      user.email=email || user.email;
      user.name=name || user.name;
      user.photoUrl= picture || user.photoUrl;
      await user.save();
    }
    return res.json({
      message : "FiberBases Login Success",
      user,
    });
  }catch(err){
    console.log(err);
    return res.status(401).json("Invalid Fiberbase Token")
  }
})
export default firebaseGoogleRouter;