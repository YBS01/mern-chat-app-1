import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';

const CueChangeModal = ({ isOpen, onClose, onUpdateStatus }) => {
  const handleStatusUpdate = (status) => {
    onUpdateStatus(status);
    onClose();
  };

// const handleStatusUpdate = async () => {
//     try {
//         const confi = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         const {data} = await axios.put(
//             'api/message/:messageId/status/:status',
//             {
//                 messageId: selectedCue._id,
//                 status: status,
//             },
//             config            
//         )
        
//     } catch (error) {
//         toast({
//             title: "Error Occured!",
//             description: "Failed to set status",
//             status: "error",
//             duration: 5000,
//             isClosable: true,
//             position: "bottom-left",
//           });
//     }
//     }   


// const onUpdateStatus = async (status) => {
//   const messageId = 'your-message-id'; // Replace with actual message ID
//   const token = 'your-auth-token'; // Replace with actual auth token

//   try {
//     const response = await fetch(`/api/messages/${messageId}/status/${status}?token=${token}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         // Include other headers as required, such as authorization headers
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update message status');
//     }

//     const updatedMessage = await response.json();
//     console.log('Message status updated:', updatedMessage);
//   } catch (error) {
//     console.error('Error updating message status:', error);
//   }
// };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cue Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ButtonGroup variant="outline" spacing="4">
            <Button colorScheme="red" onClick={() => handleStatusUpdate('live')}>
              Live
            </Button>
            <Button colorScheme="orange" onClick={() => handleStatusUpdate('standby')}>
              Standby
            </Button>
            <Button colorScheme="green" onClick={() => handleStatusUpdate('completed')}>
              Completed
            </Button>
            <Button colorScheme="blue" onClick={() => handleStatusUpdate('Pending')}>
              Pending
            </Button>
          </ButtonGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CueChangeModal;
