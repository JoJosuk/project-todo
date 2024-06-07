import { useEffect, useState } from "react";
import axios from "axios";
import Navigationbar from "./Navbar";
import Projectview from "./Projectview";
import { Button, useDisclosure } from "@nextui-org/react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [projectid, setProjectid] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [reload, setReload] = useState(false);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const onOpenRbin = () => {
    window.location.href = "/rbin";
  };
  const deleteProject = async (projectid) => {
    const response = await axios.delete(`http://localhost:5000/project/`, {
      data: { id: projectid },
      withCredentials: true,
    });
    console.log(response.data);
    setReload(!reload);
  };
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
    setProjectid(response.data.id);
    setProjectDescription(response.data.description);
    setProjectTitle(response.data.title);
    setReload(!reload);
    onOpen();
  };
  const onOpenEditProject = async (project) => {
    setProjectid(project.id);
    setProjectDescription(project.description);
    setProjectTitle(project.title);
    setReload(!reload);
    onOpen();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/project/", {
          withCredentials: true,
        });
        setProjects(response.data.projects);
        setName(response.data.name);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Please Login again or signup");
          window.location.href = "/";
        }
      }
    };
    fetchData();
  }, [reload]);

  return (
    <div className="w-full min-h-screen bg-stone-900">
      <Navigationbar name={name} />
      <div className="flex justify-center w-full">
        <div className="w-5/6">
          <h1>Projects</h1>
          <div className="flex flex-wrap gap-3 p-5">
            {projects &&
              projects.map((project, index) => {
                return (
                  <Card
                    shadow="sm"
                    key={index}
                    isPressable
                    onClick={() => onOpenEditProject(project)}
                  >
                    <CardBody className="p-0 overflow-visible">
                      <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt={project.title}
                        className="w-full object-cover h-[140px]"
                        src="https://nextui.org/images/album-cover.png"
                      />
                    </CardBody>
                    <CardFooter className="justify-between text-small">
                      <b>{project.title}</b>
                      <div
                        className="p-1 text-red-500 rounded-sm hover:bg-red-200"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteProject(project.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
          <Button onPress={onOpenProject}>➕ Add Project</Button>
          <Button onPress={onOpenRbin}>Recycle bin</Button>
          <Projectview
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onOpen={onOpen}
            id={projectid}
            title={projectTitle}
            description={projectDescription}
            setReload={setReload}
            reload={reload}
          />
        </div>
      </div>
    </div>
  );
}
