import React from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Footer from "./Footer";
import Card from "./Card";
import { toast } from "react-toastify";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
     const token = localStorage.getItem("user");
     if(token){
      setIsLoggedIn(true);
     }else{
      setIsLoggedIn(false);
     }
  },[])

  const handleLogout = async () => {
    try {
      const response = axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success((await response).data.message);
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  console.log(courses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/course/courses",
          {
            withCredentials: true,
          }
        );
        console.log(response.data.couses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourse", error);
      }
    };
    fetchCourses();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-900">
      <div className="h-screen text-white container mx-auto">
        <header className="flex  items-center justify-between p-6">
          <div className="space-x-2 flex items-center mx-20 ">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-400 font-bold">SkillLoom</h1>
          </div>
          <div className="space-x-4 mx-20">
            {isLoggedIn ? (
              <button 
                 onClick = {handleLogout}
                className="bg-transparent text-white py-2 px-4 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-white py-2 px-4 border border-white rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>
        <section className="text-center mb-20">
          <h1 className="text-4xl font-semibold text-orange-400">SkillLoom</h1>
          <br />
          <p className="text-gray-500">
            Enhanced Your Skills crafted by experts.
          </p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} className="bg-green-400 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black">
              Explore courses
            </Link>
            <Link to={"https://www.youtube.com/watch?v=8ASs9z38YVU"} className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-400 duration-300 hover:text-white">
              Courses Videos
            </Link>
          </div>
        </section>

        <section>
          <div className="slider-container ml-20  ">
            <Slider {...settings}>
              {courses.map((course) => (
                <div
                  key={course._id}
                  className=" p-4 rounded-md items-center  "
                >
                  <div className=" ">
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-48 hover:scale-105"
                        src={course.image?.url}
                        alt=""
                      />
                      <div>
                        <h2 className="text-white text-center pb-2">
                          {course.title}
                        </h2>
                        <button className="bg-orange-400 text-white px-3 py-1 rounded-3xl cursor-pointer hover:bg-orange-500">
                          Enroll now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <hr className="mt-8" />
        <div className="bg-gradient-to-r from-black to-blue-900 text-white">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
