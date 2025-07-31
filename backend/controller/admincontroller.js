import { User } from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import config from "../config.js";

import { Admin } from "../models/adminmodel.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z.string().min(3, { message: "password must be 3 char long" }),
  });

  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await Admin.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "Admin already exists" });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "signup succeded", newAdmin });
  } catch (error) {
    res.status(500).json({ errors: "Error while signup" });
    console.log("Error in Signup", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordCorrect) {
      return res.status(400).json({ errors: "Invalid Credentials" });
    }

    //jwt code logic

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_PASSWORD, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      expiresIn: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // attack
    };

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({ message: "Login successfully", admin, token });
  } catch (error) {
    res.status(500).json({ errors: "Error while login" });
    console.log("error while login", error);
  }
};

export const logout = (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ errors: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successfully !!" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("error in logout", error);
  }
};
