/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Progress,
  Textarea,
} from "@nextui-org/react";
import { useEffect } from "react";
import axios from "axios";
export default function Projectview({
  isOpen,
  onOpenChange,
  onOpen,
  id,
  title,
  description,
  setReload,
  reload,
}) {
  const [projectTitle, setProjectTitle] = useState();
  const [debouncedTitle] = useDebounce(projectTitle, 1000);
  const [projectDescription, setProjectDescription] = useState();
  const [debouncedDescription] = useDebounce(projectDescription, 1000);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todotitles, setTodotitles] = useState({});
  const [debouncedTodoTitles] = useDebounce(todotitles, 1000);
  const [changedtodoid, setChangedTodoId] = useState();
  const [reloadTodos, setReloadTodos] = useState(false);
  const [newtodotitle, setNewTodoTitle] = useState("");
  const [ratio, setRatio] = useState([0, 0]);
  // const textarearef = useRef(null);
  const updateStatus = async (idhere, status) => {
    const response = await axios.put(
      "https://project-todo-5qul.onrender.com/todo/status",
      {
        id: idhere,
        status: status,
      },
      { withCredentials: true }
    );
    setReloadTodos(!reloadTodos);
  };

  useEffect(() => {
    let tempratio = [0, 0];
    setProjectTitle(title);
    setProjectDescription(description);
    const fetchData = async () => {
      setLoading(true);
      let tempTodoTitles = {};
      const response = await axios.post(
        `https://project-todo-5qul.onrender.com/todo/get/`,
        {
          project_id: id,
        },
        {
          withCredentials: true,
        }
      );
      setTodos(response.data.todos);
      response.data.todos.map((todo) => {
        if (todo.status) {
          tempratio[0] += 1;
          tempratio[1] += 1;
        } else {
          tempratio[1] += 1;
        }
        tempTodoTitles = { ...tempTodoTitles, [todo.id]: todo.title };
      });
      setTodotitles(tempTodoTitles);
      setRatio(tempratio);
      console.log("set todos", response.data.todos);
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, [title, description, reloadTodos]);
  useEffect(() => {
    if (debouncedTitle && id != "") {
      axios
        .put(
          "https://project-todo-5qul.onrender.com/project/",
          {
            id: id,
            title: projectTitle,
            description: projectDescription,
          },
          { withCredentials: true }
        )
        .then((response) => {
          setReload(!reload);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }, [debouncedTitle]);
  useEffect(() => {
    if (debouncedDescription && id != "") {
      axios
        .put(
          "https://project-todo-5qul.onrender.com/project/",
          {
            id: id,
            title: projectTitle,
            description: projectDescription,
          },
          { withCredentials: true }
        )
        .then((response) => {
          setReload(!reload);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }, [debouncedDescription]);
  useEffect(() => {
    if (changedtodoid) {
      axios
        .put(
          "https://project-todo-5qul.onrender.com/todo/",
          {
            id: changedtodoid,
            title: todotitles[changedtodoid],
          },
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }, [debouncedTodoTitles]);

  const newtodo = async (e) => {
    e.preventDefault();
    console.log("new todo", newtodotitle);
    if (newtodotitle != "") {
      const response = await axios.post(
        "https://project-todo-5qul.onrender.com/todo/",
        {
          title: newtodotitle,
          project_id: id,
        },
        { withCredentials: true }
      );
      setReloadTodos(!reloadTodos);
      setNewTodoTitle("");
    }
  };
  const gistfetch = async () => {
    try {
      const response = await axios.post(
        "https://project-todo-5qul.onrender.com/gist/",
        {
          title: projectTitle,
          description: projectDescription,
          todos: todos,
        },
        { withCredentials: true }
      );
      window.open(response.data.url, "_blank");
    } catch (err) {
      alert("error while creating gist  ");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      placement="top-center"
      className="p-3 pt-6 dark"
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="text-white">
              {loading && <div>Loading...</div>}
              {!loading && (
                <>
                  <input
                    type="text"
                    className="w-full text-3xl font-bold text-red-400 bg-transparent border-none outline-none"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />

                  <Textarea
                    value={projectDescription}
                    label="Description"
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                    }}
                  />
                  {ratio[0] && (
                    <>
                      <h1>Progress</h1>

                      <Progress
                        aria-label="progress"
                        size="md"
                        value={(ratio[0] / ratio[1]) * 100}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md"
                      />
                    </>
                  )}
                  <h1 className="text-xl font-bold ">Completed</h1>
                  {todos &&
                    todos.map((todo, index) => {
                      if (todo.status) {
                        return (
                          <div key={index} className="flex">
                            <Checkbox
                              defaultSelected
                              onChange={async () =>
                                updateStatus(todo.id, false)
                              }
                            ></Checkbox>

                            <Input
                              type="text"
                              value={todotitles[todo.id]}
                              onChange={(e) => {
                                setTodotitles({
                                  ...todotitles,
                                  [todo.id]: e.target.value,
                                });
                                setChangedTodoId(todo.id);
                              }}
                            />
                          </div>
                        );
                      }
                    })}
                  <h1>Remaining</h1>

                  {todos &&
                    todos.map((todo, index) => {
                      if (!todo.status) {
                        return (
                          <div key={index} className="flex">
                            <Checkbox
                              onChange={(event) => updateStatus(todo.id, true)}
                            ></Checkbox>
                            <Input
                              type="text"
                              value={todotitles[todo.id]}
                              onChange={(e) => {
                                setTodotitles({
                                  ...todotitles,
                                  [todo.id]: e.target.value,
                                });
                                setChangedTodoId(todo.id);
                              }}
                            />
                          </div>
                        );
                      }
                    })}
                </>
              )}
              <form onSubmit={newtodo} className="flex items-center gap-1 p-2">
                <Input
                  type="text"
                  label="add todo here"
                  value={newtodotitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                />
                <Button type="submit" color="success">
                  Add
                </Button>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button onPress={gistfetch}>Create a gist</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
