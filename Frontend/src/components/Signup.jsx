/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const handlesubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("in handle submit", email, password);
    const data = {
      name: name,
      username: email,
      password: password,
    };

    console.log("in try", data);
    try {
      const response = await axios.post(
        "https://project-todo-5qul.onrender.com/auth/register",
        data,
        { withCredentials: true }
      );
      window.location.href = "/login";
      console.log("in try", response);
    } catch (e) {
      if (e.response.status === 400) {
        alert("Username already taken");
      }
    }
    setLoading(false);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [checkpassword, setCheckPassword] = useState("");
  return (
    <>
      {loading && (
        <div className="w-screen h-screen bg-stone-900">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div className="flex flex-col justify-center min-h-screen py-12 bg-stone-900 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-3xl font-extrabold text-center text-white">
              Create Your New Account
            </h2>
            <div className="px-4 py-8 mt-8 shadow bg-stone-800 dark:bg-stone-700 sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handlesubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full px-3 py-2 text-white border rounded-md shadow-sm appearance-none placeholder-stone-400 bg-stone-700 border-stone-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full px-3 py-2 text-white border rounded-md shadow-sm appearance-none placeholder-stone-400 bg-stone-700 border-stone-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3 py-2 text-white border rounded-md shadow-sm appearance-none placeholder-stone-400 bg-stone-700 border-stone-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
