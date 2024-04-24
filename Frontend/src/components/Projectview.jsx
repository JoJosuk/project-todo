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
  const textarearef = useRef(null);
  const updateStatus = async (idhere, status) => {
    const response = await axios.put(
      "http://localhost:5000/todo/status",
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
        `http://localhost:5000/todo/get/`,
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
          "http://localhost:5000/project/",
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
          "http://localhost:5000/project/",
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
          "http://localhost:5000/todo/",
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
  const adjustHeight = () => {
    if (textarearef.current) {
      textarearef.current.style.height = "auto";
      textarearef.current.style.height = `${textarearef.current.scrollHeight}px`;
    }
  };

  const newtodo = async (e) => {
    e.preventDefault();
    console.log("new todo", newtodotitle);
    if (newtodotitle != "") {
      const response = await axios.post(
        "http://localhost:5000/todo/",
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
        "http://localhost:5000/gist/",
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
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full mt-2 text-white bg-transparent outline-none resize-none"
                    value={projectDescription}
                    ref={textarearef}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                      adjustHeight();
                    }}
                  />
                  <h1>Progress</h1>
                  {ratio[0] && (
                    <>
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
                  <h1>Completed</h1>
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
                            <input
                              type="text"
                              className="w-full text-2xl font-bold "
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
                            <input
                              type="text"
                              className="w-full text-2xl font-bold "
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
              <form onSubmit={newtodo}>
                <h1>add todo here</h1>
                <input
                  type="text"
                  className="w-full text-2xl font-bold bg-transparent "
                  value={newtodotitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                />
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
