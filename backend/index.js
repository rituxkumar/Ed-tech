import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/courseroute.js";
import userRoute from "./routes/userroute.js";
import adminRoute from "./routes/adminroute.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import cookieParser from "cookie-parser";


app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use(express.json());
dotenv.config();
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin:["https://ed-tech-eta-five.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const mongoDb = process.env.MONGODB_URL;
const port = process.env.PORT || 4000;

try {
  await mongoose.connect(mongoDb);
  console.log("database connected successfully");
} catch (error) {
  console.log("database connection failed");
}

//defining route

app.use("/api/v1/course", courseRoute);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

// Co
// nfiguration code of cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.get("/", (req, res) => {
  res.send("hello world !!!");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
