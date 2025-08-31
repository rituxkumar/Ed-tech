import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spiner from "../components/Spiner";
// import { BACKEND_URL } from "../../utils/utils";

const CourseCreate = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
    const [spiner, setSpiner] = useState(false);
  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("price", price);

    const token = localStorage.getItem("admin");
    // const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSpiner(true)
      const response = await axios.post(
        "http://localhost:3000/api/v1/course/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message || "course created successfully🚀");
        navigate("/admin/our-courses")
        setTitle("");
        setImage("");
        setPrice("");
        setDescription("");
        setImagePreview("");

        navigate('/admin/our-courses')
      } else {
        console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }finally{
      setSpiner(false)
    }

  };
  return (
    <div>
      <div className="min-h-screen  py-10">
        <div className="max-w-4xl mx-auto p-6 border w-[350px] rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            {
              spiner ?<div> <Spiner/></div> :  <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer"
            >
              Create Course
            </button>
            }

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseCreate;
