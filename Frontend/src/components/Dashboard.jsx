import { useEffect, useState } from "react";
import axios from "axios";
import Navigationbar from "./Navbar";
import Projectview from "./Projectview";
import { Button, useDisclosure } from "@nextui-org/react";

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [projectid, setProjectid] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const onOpenProject = async () => {
    const response = await axios.post(
      "http://localhost:5000/project/",
      {
        title: "Untitled",
        description: "Here goes description",
      },
      {
        withCredentials: true,
      }
    );
    console.log("the data is ", response.data);
    setProjectid(response.data.id);
    setProjectDescription(response.data.description);
    setProjectTitle(response.data.title);

    onOpen();
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/project/", {
        withCredentials: true,
      });
      console.log(response);
      setProjects(response.data.projects);
      setName(response.data.name);
    };
    fetchData();
  }, []);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  return (
    <div className="w-full min-h-screen bg-stone-900">
      <Navigationbar name={name} />
      <div>hey</div>
      <div className="flex justify-center w-full">
        <div className="w-5/6">
          <Button onPress={onOpenProject}>➕ Add Project</Button>
          <Projectview
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onOpen={onOpen}
            id={projectid}
            title={projectTitle}
            description={projectDescription}
          />
        </div>
      </div>
    </div>
  );
}
