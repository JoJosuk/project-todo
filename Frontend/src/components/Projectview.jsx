/* eslint-disable react/prop-types */
import { useState } from "react";
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
}) {
  const [projectTitle, setProjectTitle] = useState();
  const [debouncedTitle] = useDebounce(projectTitle, 1000);
  const [projectDescription, setProjectDescription] = useState();
  const [debouncedDescription] = useDebounce(projectDescription, 1000);
  useEffect(() => {
    setProjectTitle(title);
    setProjectDescription(description);
  }, [title, description]);
  useEffect(() => {
    if (debouncedTitle) {
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
          console.log(response);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }, [debouncedTitle]);
  useEffect(() => {
    if (debouncedDescription) {
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
          console.log(response);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }, [debouncedDescription]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      className="p-3 pt-6 dark"
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="text-white">
              <input
                type="text"
                className="w-full text-2xl font-bold bg-transparent border-none outline-none"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
              <textarea
                className="w-full mt-2 text-white bg-transparent outline-none"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
