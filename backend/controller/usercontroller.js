import { User } from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import config from "../config.js";
import { Course } from "../models/coursemodel.js";
import { Purchase } from "../models/purchasemodel.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z.string().min(3, { message: "password must be 3 char long" }),
  });

  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "signup succeded", newUser });
  } catch (error) {
    res.status(500).json({ errors: "Error while signup" });
    console.log("Error in Signup", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ errors: "Invalid Credentials" });
    }

    //jwt code logic

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_PASSWORD, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      expiresIn: 24*60*60*1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // attack
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({ message: "Login successfully", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error while login" });
    console.log("error while login", error);
  }
};

export const logout = (req, res) => {
  try {
    if(!req.cookies.jwt){
      return
      res.status(401).json({errors:"Kindly login first"})
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successfully !!" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("error in logout", error);
  }
};

export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });
    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });
    res.status(200).json({ purchased, courseData });
  } catch (error) {
    res.status(500).json({errors:"Error in purchase"});
    console.log("error in purchase",error);
    
  }
};
