import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/login",
        {
          email,password
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      

      console.log("Login Done:", response.data);
      toast.success(response.data.message);
      console.log(response.data.token);
      
      localStorage.setItem("admin",response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-900">
      <div className="flex items-center justify-between text-white h-screen container mx-auto flex-col">
        <header className="flex w-full  items-center justify-between p-6">
          <div className="space-x-2 flex items-center mx-20 ">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-400 font-bold">SkillLoom</h1>
          </div>
          <div className="space-x-4 mx-20">
            <Link
              to={"/admin/signup"}
              className="bg-transparent text-white py-2 px-4 border border-white rounded"
            >
              Signup
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
        <div className="bg-gray-900 p-8 mb-10 rounded-lg shadow-lg w-[500px] ">
          <h2>
            Welcome to <span className="text-orange-400">SkillLoom</span>
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            Just Login To Access AdminDashboard...
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
            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-orange-400 hover:bg-blue-500 w-full text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

