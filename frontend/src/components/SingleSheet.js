import { Box, Text, Table, Tbody, Tr, Td, Spinner, FormControl, Input, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import CueChangeModal from "./miscellaneous/CueChangeModal";


const ENDPOINT = "http://localhost:5000"; // Replace with your actual endpoint
let socket;

const SingleSheet = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedCue, setSelectedCue] = useState(null); // State to store selected cue

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Function to handle cue status update
  // const handleUpdateStatus = (status) => {
  //   // Here you would typically make an API call to update the cue status
  //   console.log("Updating cue status:", status);
  //   setSelectedCue(null); // Reset selectedCue
  // };

// Assume setSelectedCue is a state setter that stores the selected message's ID
const handleUpdateStatus = async (status) => {
  console.log("Updating cue status:", status);
  console.log("Updating message:", selectedCue);

  if (!selectedCue) {
    console.error("No cue selected");
    return;
  }

  try {
    const response = await fetch(`/api/message/${selectedCue}/status/${status}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
        // Include other headers as required, such as authorization headers
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update message status: ${response.status}`);
    }

    const updatedMessage = await response.json();
    console.log('Message status updated:', updatedMessage);
  } catch (error) {
    console.error('Error updating message status:', error);
  }

  setSelectedCue(null); // Reset the selected message
};


  

  // Function to handle cue click and open modal
  const handleCueClick = (message) => {
  setSelectedCue(message._id); // Set the selected message ID
  setShowModal(true); // Open the modal
};

  // const handleCueClick = (cue) => {
  //   setSelectedCue(cue);
  //   setShowModal(true);
  // };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (event) => {
    // Your sendMessage logic
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect(); // Clean up socket connection on component unmount
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchAgain]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // Your message received logic
    });
  });

  const typingHandler = (e) => {
    // Your typing handler logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans"
            d="flex" justifyContent={{ base: "space-between" }} alignItems="center">
            <IconButton d={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
            {messages && (!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            ))}
          </Text>
          <Box d="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <Box overflowY="auto" flexGrow={1}>
                <Table variant="simple">
                  <Tbody>
                    {/* Render cues as rows */}
                    {messages.map((message, index) => (
                      <Tr key={index} onClick={() => handleCueClick(message)} style={{ cursor: "pointer", background: message.status === "live" ? "red" : (message.status === "standby" ? "orange" : "white") }}>
                        <Td>{message.content}</Td>
                        <Td>{message.sender.name}</Td>
                        {/* Add other message attributes as needed */}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                </div>
              ) : (
                <></>
              )}
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
      {/* Render CueChangeModal */}
      <CueChangeModal isOpen={showModal} onClose={() => setShowModal(false)} onUpdateStatus={handleUpdateStatus} />
    </>
  );
};

export default SingleSheet;
