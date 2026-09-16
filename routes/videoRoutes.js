import mongoose from "mongoose";
import express from "express";

import Video from "../models/video.js";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/auth.js";


const router = express.Router();

router.post("/upload", authMiddleware, async (req, res) => {
  try {
    //   console.log("BODY:", req.body);
    //  console.log("FILES:", req.files);

    const { title, description, category, tags } = req.body;

    // Check video and thumbnail
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        message: "Video and thumbnail are required",
      });
    }

    // Upload video to Cloudinary
    const videoUpload = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
        folder: "videos",
      },
    );

    // Upload thumbnail to Cloudinary
    const thumbnailUpload = await cloudinary.uploader.upload(
      req.files.thumbnail.tempFilePath,
      {
        folder: "thumbnails",
      },
    );

    // Create video document
    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      user_id: req.user.id,

      videoUrl: videoUpload.secure_url,
      videoId: videoUpload.public_id,

      thumbnailUrl: thumbnailUpload.secure_url,
      thumbnailId: thumbnailUpload.public_id,

      category,
      tags: tags ? tags.split(",") : [],
    });

    // Save to MongoDB
    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) =>{
  try{
      const {title,description,category,tags} = req.body;
      const VideoId = req.params.id;

      let video = await Video.findById(VideoId);
      // Check if the video exists
      if(!video){
          return res.status(404).json({message:"Video not found"});
      }
      // Check if the user is the owner of the video
      if(video.user_id.toString() !== req.user.id.toString()){
          return res.status(403).json({message:"You are not authorized to update this video"});
      }
      //thumbnail change 
      if(req.files && req.files.thumbnail){
          // Delete the old thumbnail from Cloudinary
          await cloudinary.uploader.destroy(video.thumbnailId);

          // Upload the new thumbnail to Cloudinary
          const thumbnailUpload = await cloudinary.uploader.upload(
              req.files.thumbnail.tempFilePath,
              {
                  folder: "thumbnails",
              }
          );
          video.thumbnailUrl = thumbnailUpload.secure_url;
          video.thumbnailId = thumbnailUpload.public_id;
      }
      // Update the video details
      video.title = title || video.title;
      video.description = description || video.description;
      video.category = category || video.category;
      video.tags = tags ? tags.split(",") : video.tags;
      
      // Save the updated video
      await video.save(); 
      res.status(200).json({message:"Video updated successfully", video});
      

  }catch(error){
      console.log(error);
      res.status(500).json({error:error.message});
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;

    let video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (video.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(video.videoId, {
      resource_type: "video",
    });

    // Delete thumbnail from Cloudinary
    await cloudinary.uploader.destroy(video.thumbnailId);

    // Delete video from MongoDB
    await Video.findByIdAndDelete(videoId);

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/my-videos", authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({ user_id: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    // Use findByIdAndUpdate to add the user ID to the viewedBy array if not already present
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { viewedBy: userId }, // Add user ID to viewedBy array, avoiding duplicates
      },
      { new: true }, // Return the updated video document
    );

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post("/like", authMiddleware, async (req, res) => {
  try {
    const { videoId } = req.body;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { likedBy: req.user.id },
        $pull: { disLikedBy: req.user.id },
      },
      { new: true },
    );

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.status(200).json({
      message: "Liked the video",
      likes: video.likedBy.length,
    });
  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});



export default router;
