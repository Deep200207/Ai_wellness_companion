    import express from "express"
    import Profile from "../models/Profile.js";

    const profilerouter=express.Router();

    profilerouter.post("/profile",async (req,res)=>{
        try{
            const user=req.body;
            console.log(user)
            const newProfile= new Profile(user);
            console.log(newProfile)
            await newProfile.save();
            return res.status(201).json({
                succuss:true,
                data: req.body
            });
        }
        catch(err){
            if (err.code== 11000){
                return res.status(400).json({error:"Email Already Exist"})
            }
            res.status(500).json({error:err.message});
        }
    })
    profilerouter.post("/checkprofile", async(req,res)=>{
        try{
            const {email}=req.body;
            console.log({email})
            const checkUser= await Profile.findOne({email});
            console.log(checkUser)
            if(checkUser){
                res.status(201).json(checkUser);
            }
            else{
                res.status(404).json({ message: "User not found" });
            }
        }
        catch(err){
            res.status(500).json({error:err.message});
        }
    })
    export default profilerouter