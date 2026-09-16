import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Upload the logo to Cloudinary
    console.log(req.files);

    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath,
    );

    console.log("IMAGE✍️", uploadImage);

    // Create a new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
      channelName: req.body.channelName,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });
    
    //#writhing code by my own 
    // Save user to MongoDB
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message});
  }
});


// Login route
router.post("/login",async(req,res)=>{
  try{
      console.log("REQ.USER =", req.user);
      console.log("USER ID =", req.user?._id);

    const existingUser = await User.findOne({email:req.body.email});
    if(!existingUser){
      return res.status(404).json({message:"User not found"});
    }

   const isValid= await bcrypt.compare(
    req.body.password,
    existingUser.password
  );

   if(!isValid){
    return res.status(401).json({message:"Invalid password"});
   }

   const token = jwt.sign({
     _id: existingUser._id,
     channelName: existingUser.channelName,
     email: existingUser.email,
     phone: existingUser.phone,
     logoId: existingUser.logoId,
   },process.env.JWT_SECRET, {expiresIn:"10d"});

    res.status(200).json({
      _id: existingUser._id,
      channelName: existingUser.channelName,
      email: existingUser.email,
      phone: existingUser.phone,
      logoId: existingUser.logoId,
      logoUrl: existingUser.logoUrl,
      token:token,  
      subscription: existingUser.subscription,  
      subsrcibedChannels: existingUser.subscribedChannels,


    });




  }catch(error){
    console.log(error);
    res.status(500).json({error:error.message});
  }
});

//UPDATE USER PROFILE

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { channelName, phone } = req.body;
    let updatedData = { channelName, phone };

    // Handle profile picture update
    if (req.files && req.files.logo) {
      const uploadedImage = await cloudinary.uploader.upload(
        req.files.logo.tempFilePath,
      );
      updatedData.logoUrl = uploadedImage.secure_url;
      updatedData.logoId = uploadedImage.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true },
    );

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//subscribe endpoint
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { channelId } = req.body; // userId = current user, channelId = channel to subscribe to

    if (req.user._id === channelId) {
      return res
        .status(400)
        .json({ error: "You cannot subscribe to yourself" });
    }

    // Add the channel to user's subscribed channels
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { subscribedChannels: channelId },
    });

    // Increment subscriber count
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 },
    });

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});






export default router;
