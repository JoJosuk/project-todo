/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
function App() {
  // const [count, setCount] = useState(0)

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
