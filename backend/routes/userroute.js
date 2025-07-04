import express from "express";
import { signup,login, logout, purchases } from "../controller/usercontroller.js";
import { Purchase } from "../models/purchasemodel.js";
import userMiddleware from "../middlewares/usermid.js";


const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/purchases",userMiddleware,purchases);

export default router;