import express from 'express'
import Profile from '../models/Profile.js';

const updateProfileRouter = express.Router();

updateProfileRouter.put('/update',async (req, res) =>{
    try{
        const { email,age,hegiht,weight} = req.body;
        
        const updateProfile = await Profile.findOneAndUpdate(
            {email: email},
            {age: age, height: hegiht, weight: weight},
        )
        if(!updateProfile){
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', profile: updateProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
)
export default updateProfileRouter;