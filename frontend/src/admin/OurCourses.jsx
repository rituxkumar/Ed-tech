import axios from "axios";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";

const OurCourses = () => {
  const token = localStorage.getItem("admin");
  
  // const token = admin.token;
  const navigate = useNavigate();
  if(!token){
    toast.error("Please login to admin");
    navigate("/admin/login");
  }
  const [loading, setLoading] = useState(true);
   const [spiner, setSpiner] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setSpiner(true)
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/course/courses`,
          {
            withCredentials: true,
          }
        );

        console.log(response);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }finally{
        setSpiner(false)
      }
    };
    fetchCourses();
  }, [courses]);

  // delete course

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/course/delete/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      
      const updatedCourses = courses.filter((course) => course._id !== courseId);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error while deleting course", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 p-8 mx-auto bg-gradi">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 "
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 mt-7 ">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4 w-[250px] mt-4 ">
            {/* Course Image */}
            <img 
              src={course?.image?.url}
              alt={course.title}
              className="w-[200px] h-[200px]  rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title.length > 20
                ? `${course.title.slice(0, 20)}...`
                : course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 20
                ? `${course.description.slice(0, 20)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4  rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4  rounded hover:bg-red-900 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCourses;
