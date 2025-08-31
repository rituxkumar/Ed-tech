import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../utils/utils";
import Spiner from "../components/Spiner";

const UpdateCourse = () => {

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    const fetchCoursesData = async()=>{
      try {
      
        const {data} =await axios.get(`http://localhost:3000/api/v1/course/${id}`,{
          withCredentials:true,
        })
        console.log(data);
        setTitle(data.course.title)
        setDescription(data.course.description)
        setPrice(data.course.price)
        setImagePreview(data.course?.image?.url)
       
        
      } catch (error) {
        console.log(error);
        
        
      }
    }
    fetchCoursesData();
  },[id])

   const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }
    const admin = localStorage.getItem("admin");
    
    if (!admin) {
      toast.error("Please login to admin");
      return;
    }
    try {
       setLoading(true)
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully22");
      navigate("/admin/our-courses"); // Redirect to courses page after update
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.errors);
    }finally{
      setLoading(false)
    }

  };

  // if (loading) {
  //   return <p className="text-center text-gray-500">Loading...</p>;
  // }

   return (
    <div className="bg-gradient-to-r from-black to-blue-900 text-white ">
      <div className="min-h-screen w-full  py-10">
        <div className="max-w-2xl w-[78%] md:w-[80%] mx-auto p-6 border rounded-lg shadow-lg  ">
          <h3 className="text-2xl font-semibold mb-4">Update Course</h3>
          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2 ">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Course"
                  className="w-[200px] mb-2 max-w-sm h-[200px] rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>
            {  loading  ?  <Spiner />:
             
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer"
            >
              Update Course
            </button>
}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
