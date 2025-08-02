import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Courses from "./components/Courses";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

const App = () => {

 const user = localStorage.getItem("user");
 const admin = localStorage.getItem("admin");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/purchases" element={user?<Purchases /> :<Navigate to={"/login"}/>} />
        <Route path="/buy/:courseId" element={<Buy />} />

        {/* Admin Route*/}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={admin?<Dashboard />:<Navigate to={"/admin/login"}/>} />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>
    </div>
  );
};

export default App;
