import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

//signup
router.post("/signup", async (req ,res) => {
    try {
        const {name ,email , password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashPassword = await bcrypt.hash(password ,10);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        const token =jwt.sign(
            {
                userId: user._id,
                email:user._email
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn :"7d"
            } 
        );

        res.status(201).json({message :"User registered successfully" , token, user:{
            id: user._id,
            name:user.name,
            email:user.email
        }
    });
     } catch (error) {
        console.log(error);

        res.status(500).json({message:" Server error"});
    }
});

//login
router.post("/login" , async (req ,res) =>{
    try {
        const {email , password} =req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const isPasswordC = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordC){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token = jwt.sign(
            {
                userId : user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        res.status(200).json({message:"Login successful" , token, user :{
            id:user._id,
            name:user.name,
            email:user.email
        }
    });

    } catch (error) {
        console.log(error);

        res.status(500).json({message :"Server error"});
    }
});

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    });
});



export default router;