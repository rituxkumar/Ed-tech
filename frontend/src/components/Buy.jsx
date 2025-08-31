import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Buy = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("user");
  const location = useLocation();
  const { title, description, image, price } = location.state || {};
  console.log(title, description, price, image);

  // console.log(user);

  // const token = user.token;
  console.log(token);

  const handlePurchase = async () => {
    if (!token) {
      toast.error("please login first to purchase the course");
      return;
    }
    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:3000/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(response);

      toast.success(response.data.message || "Course purchased successfully");
      navigate("/purchases");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.response?.status === 400) {
        toast.error("you have already purchased this course 😎");
         navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col ">
      <div className="border-2 rounded-md p-5 w-[70%] md:w-[40%]">
        <img className="w-[350px] h-[300px] " src={image} alt="" />
        <p>
          Title :<span className="text-center font-semibold text-blue-500">{title}</span>{" "}
        </p>
        <p>
          Price :<span className="text-center font-semibold text-blue-500">{price}</span>
        </p>
        <p>
          Description :{" "}
          <span className="text-center font-semibold text-blue-500">{description}</span>
        </p>
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-3 hover:bg-blue-700 duration-300"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "processing..." : "Buy Now"}
      </button>
    </div>
  );
};

export default Buy;
