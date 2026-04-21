import useAuthStore from "../store/useAuthStore.js";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [state, setState] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { register, login, isLoading } = useAuthStore();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const { name, email, password } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === "register")
      await register({ name, email, password, navigate });
    else
      await login({ email, password, navigate });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center justify-center h-full w-full bg-[#131314] p-2"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-5 mx-auto items-start p-8 py-12 w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl border border-gray-800 bg-[#1E1F20] text-gray-100"
      >
        <p className="text-3xl font-bold m-auto text-gray-100 tracking-tight">
          <span className="text-primary dark:text-accent font-bold">
            NexusAI
          </span>
          {state === "login" ? " Login" : " Sign Up"}
        </p>
        {/* name field  */}
        {state === "register" && (
          <div className="w-full relative">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full peer bg-[#131314] border border-gray-100/20 focus:border-gray-100/50 focus:ring-3 focus:ring-gray-100/20 rounded-lg py-3 px-4 outline-none focus:border-primary  placeholder-gray-400 transition-colors duration-200"
            />
          </div>
        )}
        {/* email field  */}
        <div className="relative w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full peer bg-[#131314] border border-gray-100/20 focus:border-gray-100/50 focus:ring-3 focus:ring-gray-100/20 rounded-lg py-3 px-4 outline-none focus:border-primary  placeholder-gray-400 transition-colors duration-200"
          />
        </div>
        {/* password field  */}
        <div className="relative w-full">
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full bg-[#131314] peer border border-gray-100/20 focus:border-gray-100/50 focus:ring-3 focus:ring-gray-100/20 rounded-lg py-3 px-4 outline-none focus:border-primary  placeholder-gray-400 transition-colors duration-200"
          />
        </div>
        {/* toggle login/register  */}
        <div className="flex items-center justify-center w-full text-base font-semibold text-gray-400 mt-2">
          {state === "register" ? (
            <p>
              Already have account ?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary cursor-pointer dark:text-accent font-semibold hover:underline"
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              Create an account ?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary cursor-pointer dark:text-accent font-semibold hover:underline"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
        {/* submit button  */}
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-2 w-full py-3 rounded-lg font-semibold bg-linear-to-br from-blue-500 to-purple-600 cursor-pointer text-white transition-all active:scale-95 duration-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <LoaderIcon
                size={20}
                className="h-7 w-7 animate-spin text-white"
              />
              <span>Please wait...</span>
            </div>
          ) : state === "register" ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;