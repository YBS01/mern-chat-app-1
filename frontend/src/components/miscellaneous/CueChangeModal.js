import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, FormControl, Input, useToast, Box, IconButton, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const CueChangeModal = ({ isOpen, onClose, cueId, setFetchAgain }) => {
  const [status, setStatus] = useState(""); // State to hold the selected status
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store token in localStorage
        },
      };
      const { data } = await axios.put(`/api/message/${cueId}/status`, { status }, config); // Updated API endpoint
      toast({
        title: "Cue Status Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the modal after successful update
      setFetchAgain(true); // Trigger a fetch update
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "An error occurred while updating the cue status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Cue Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Input
              placeholder="Enter cue status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleChangeStatus()} colorScheme="blue" isLoading={loading}>
            Update Status
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CueChangeModal;
