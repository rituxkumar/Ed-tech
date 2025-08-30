import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Spiner from "./Spiner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Done:", response.data);
      toast.success(response.data.message);
      console.log(response.data.token);
      
      localStorage.setItem("user",response.data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }finally{
      setLoader(false)
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-900">
      <div className="flex items-center justify-between text-white h-screen container mx-auto flex-col">
        <header className="flex w-full md:gap-1  items-center justify-between p-6">
          <div className="space-x-2 flex items-center md:mx-20   ">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 onClick={()=>navigate('/')}  className="text-2xl text-orange-400 font-bold cursor-pointer">SkillLoom</h1>
          </div>
          <div className="space-x-4 mx-20 ">
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
          </div>
        </header>

        {/*signup form */}
        <div className="bg-gray-900 p-8 my-auto rounded-lg shadow-lg w-[500px]  ">
          <h2  className="text-center font-bold ">
            Welcome to <span className="text-orange-400 ">SkillLoom</span>
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            🚀Just Login To Join Us...
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 mb-2">
                email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-2">
                password
              </label>
              <div className="relative  ">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" relative w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                {/* <span className="absoulte left-0 top-0  text-gray-500 cursor-pointer">
                  👁️
                </span> */}
              </div>
            </div>
           

            { loader ?
              <div><Spiner/></div> : <button
              onClick={handleSubmit}
              type="submit"
              className="bg-orange-400 hover:bg-blue-500 w-full text-white py-3 px-6 rounded-md transition cursor-pointer"
            >
              Login
            </button>
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
