import express from "express"
import User from "../models/User.js";
import bcrypt from "bcrypt"

const authrouter = express.Router();
authrouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedpassword });
        await user.save();
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ error: "Email Already Exist" });
        }
        else if (err.code == 'ENOTFOUND') {
            return res.status(503).json({ message: "No Internet Connection. Please Retry" })
        }
        res.status(500).json({ error: err.message });
    }
})
authrouter.post("/login", async (req, res) => {
    try {
        console.log("Login Request Body:", req.body);
        const checkUser = await User.findOne({ email: req.body.email });
        console.log("User Found:", checkUser);

        // const checkUser = await User.findOne({ email: req.body.email });
        if (!checkUser) {
            return res.status(404).json({
                success: false,
                error: "User Not Found"
            })
        }
        const validPass = await bcrypt.compare(req.body.password, checkUser.password)
        if (!validPass) {
            return res.status(400).json({
                success: false,
                error: "Invalid Password"
            })
        }
        return res.json({
            success: true,
            message: "User Logged Successfully",
            data: {
                name: checkUser.name,
                email: checkUser.email
            }
        })
    }
    catch (err) {
        console.error("Login error:", err.message);
        if (err.message = 'users.findOne()') {
            console.log("This is called")
            return res.status(503).json({error:"No Internet"})
        }
        else if (err.code == 'ENOTFOUND') {
            return res.status(503).json({ error: "No Internet Connection. Please Retry" })
        }
        
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
})
export default authrouter;
