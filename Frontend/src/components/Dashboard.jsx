import { useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      const response = axios.get("http://localhost:5000/project/", {
        withCredentials: true,
      });
      console.log(response.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <div>hey</div>
    </div>
  );
}
