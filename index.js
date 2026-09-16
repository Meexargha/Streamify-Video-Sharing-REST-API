import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
 

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";




dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(fileUpload({ 
   useTempFiles: true,
   tempFileDir: "/tmp/"

 }));


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);

app.listen(process.env.PORT,()=>{
   console.log(`Server is running at http://localhost:${process.env.PORT}`);

})