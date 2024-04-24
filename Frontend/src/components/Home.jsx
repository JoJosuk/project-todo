import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Welcome to Project Todo
      </h1>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}

export default Home;
