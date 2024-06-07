import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

export default function Rbin() {
  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchbin = async () => {
      let data = await axios.get("http://localhost:5000/todo/rbin", {
        withCredentials: true,
      });
      console.log(data.data.todotable);
      setTodo(data.data.todotable);
      setLoading(false);
    };
    fetchbin();
  }, []);
  const restore = async (id) => {
    await axios.put("http://localhost:5000/todo/restore", {
      id: id,
    });
  };
  const deleteperma = async (id) => {
    try {
      let response = await axios.post("http://localhost:5000/todo/permanent", {
        id: id,
      });
      console.log("response on del", response);
    } catch (e) {
      console.log(e);
    }
  };
  if (loading) {
    return <>Loading</>;
  }
  return todo.map((to, index) => {
    return (
      <div key={index} className="flex gap-2 p-3">
        <p>{to.title}</p>
        <Button onClick={async () => restore(to.id)}>Restore</Button>
        <Button onClick={async () => deleteperma(to.id)}>Delete</Button>
      </div>
    );
  });
}
