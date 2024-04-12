import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input } from "@chakra-ui/react";
import { useState } from "react";

const UpdateModal = ({ isOpen, onClose, onUpdate, field }) => {
  const [value, setValue] = useState("");

  const handleUpdate = () => {
    onUpdate(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update {field}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input variant="filled" bg="#E0E0E0" placeholder={`Enter ${field}..`} value={value} onChange={(e) => setValue(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const AddButton = ({ onClick }) => {
  return (
    <Button
      position="fixed"
      bottom="4"
      right="4"
      zIndex="999"
      onClick={onClick}
      colorScheme="blue"
      size="lg"
      boxShadow="lg"
      borderRadius="full"
      p="4"
      fontSize="lg"
    >
      Add
    </Button>
  );
};


export default {UpdateModal, AddButton};
