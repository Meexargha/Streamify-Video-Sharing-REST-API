import dotenv from "dotenv";

dotenv.config();

import { v2 as cloudinary } from "cloudinary";

console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? "FOUND" : "NOT FOUND");
console.log(
  "API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "FOUND" : "NOT FOUND",
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
