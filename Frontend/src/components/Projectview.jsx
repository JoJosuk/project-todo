/* eslint-disable react/prop-types */
import { useState } from "react";
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
export default function Projectview({
  isOpen,
  onOpenChange,
  onOpen,
  id,
  title,
  description,
}) {
  useEffect(() => {
    setProjectTitle(title);
    setProjectDescription(description);
  }, [title, description]);
  console.log("the id is ", id, title, description);
  const [projectTitle, setProjectTitle] = useState();
  const [projectDescription, setProjectDescription] = useState();
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
