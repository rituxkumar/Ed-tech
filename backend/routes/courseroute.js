import express from "express";
import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controller/coursecontroller.js";
import userMiddleware from "../middlewares/usermid.js";
import adminMiddleware from "../middlewares/adminmid.js";

const router = express.Router();

router.post("/create",adminMiddleware, createCourse);
router.put("/update/:courseId",adminMiddleware,updateCourse);
router.delete("/delete/:courseId",adminMiddleware,deleteCourse);
router.get("/courses",getCourses);
router.get("/:courseId",courseDetails);
router.post("/buy/:courseId",userMiddleware,buyCourses);

export default router;
