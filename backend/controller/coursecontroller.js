import { Course } from "../models/coursemodel.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchasemodel.js";

// export const createCourse = async (req, res) => {
//   const adminId = req.adminId
//   const { title, description, price } = req.body;
//   // console.log(title,description,price);

//   try {
//     if (!title || !description || !price) {
//       return res.status(400).json({ errors: "All fields are required" });
//     }

//     const { image } = req.files;
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ errors: "No file uploaded" });
//     }

//     const allowedFormat = ["image/png", "image/jpeg"];
//     if (!allowedFormat.includes(image.mimetype)) {
//       return res
//         .status(400)
//         .json({ errors: "invalid file format,jpg and png are allowed" });
//     }

//     //cloudinary code
//     const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

//     if (!cloud_response || cloud_response.error) {
//       return res
//         .status(400)
//         .json({ errors: "Error while uploading file to cloudinary" });
//     }

//     const courseData = {
//       title,
//       description,
//       price,
//       image: {
//         public_id: cloud_response.public_id,
//         url: cloud_response.url,
//       },
//       creatorId:adminId
//     };
//     const course = await Course.create(courseData);
//     res.json({
//       message: "Course created successfully",
//       course,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Error while creating course" });
//   }
// };

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;


  try {
    // Basic validation
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    // Check if file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const image = req.files.image;

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only JPG and PNG are allowed" });
    }

    // Upload to Cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error while uploading file to Cloudinary" });
    }

    // Save course
    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    });

    res.json({
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Error while creating course" });
  }
};


export const updateCourse = async (req, res) => {
  const adminId = req.adminId
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const course = await Course.updateOne(
      {
        _id: courseId,
        creatorId:adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );
    res.status(201).json({ message: "course updated successfully",course });
  } catch (error) {
    res.status(500).json({ error: "Error while course updating" });
    console.log("error in course updating", error);
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId
  const { courseId } = req.params;
  try {
    console.log(courseId,adminId);
    
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId:adminId,
    });
    console.log(course);
    
    if (!course) {
      return res.status(400).json({
        error: "course are not found",
      });
      res.status(200).json({ message: "Course deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while course deleting" });
    console.log("Error while course deleting", error);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error while getting course" });
    console.log("Error while fetch course", error);
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "error while getting course details" });
    console.log("Error in course details", error);
  }
};

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId)
    if(!course){
      return res.ststus(404).json({error:"Courses are not found"});
    }
    const existingPurchase = await Purchase.findOne({userId,courseId})
    if(existingPurchase){
      return res.status(400).json({error:"User has already purchased this course"});
    }
      
    const newPurchase = new Purchase({userId,courseId})


    await newPurchase.save()
    res.status(201).json({message:"Course purchased successfully",newPurchase})


  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying", error);
  }
};
