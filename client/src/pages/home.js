import React, { useState, useRef, useEffect } from "react";
import { MenuIcon, PlusIcon } from "../constants";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { LeftSection, RightSection } from "../Components";
import { useParams, useHistory, useNavigate } from "react-router-dom";
import { Button, Modal } from "flowbite-react";

export default function Home() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const textareaRef = useRef(null);
  const [showChatHistory, setShowChatHistory] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [sessionId, setSessionId] = useState(
    session_id ? session_id : uuidv4()
  );

  ////SHOW LỊCH SỬ CHAT

  useEffect(() => {
    getConversationLists();
  }, []);

  useEffect(() => {
    setSessionId(session_id ? session_id : uuidv4());
  }, [session_id]);

  useEffect(() => {
    if (session_id) {
      getMessageListBySessionId();
      setIsBotReplying(false);
    } else {
      setChatHistory([]);
    }
  }, [sessionId]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  const getBotReply = async () => {
    const userMessage = { Session_ID: sessionId, User: userInput, Bot: "" };

    setChatHistory((prevMessages) => [...prevMessages, userMessage]);

    try {
      setIsProcessing(true);

      const response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "handle-query",
        {
          input: userInput,
          history: chatHistory,
        }
      );

      return response.data;
    } catch (error) {
      setIsProcessing(true);
      console.log("Error getting reply from model!");
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const botResponse = await getBotReply();

    const botMessage = {
      session_id: sessionId,
      user: userInput,
      bot: botResponse.response,
      context1: botResponse.context1,
      context2: botResponse.context2,
    };

    try {
      await axios.post(
        process.env.REACT_APP_API_BASE_URL + "save-message",
        botMessage,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!session_id) {
        getConversationLists();

        navigate(`/c/${sessionId}`, { replace: true });
      }

      setIsProcessing(false);

      const replyMessage = {
        Session_Id: sessionId,
        User: userInput,
        Bot: botResponse.response,
        Context1: botResponse.context1,
        Context2: botResponse.context2,
      };

      setChatHistory((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = replyMessage;
        return updatedMessages;
      });

      setIsBotReplying(true);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error sending message to API:", error);
    }
  };

  const getConversationLists = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "get-conversations")
      .then((response) => {
        setConversationList(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the conversation list!",
          error
        );
      });
  };

  const getMessageListBySessionId = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "get-messages/" + sessionId)
      .then((response) => {
        setChatHistory(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the message list!", error);
      });
  };

  ///XỬ LÝ HỘP CHAT INPUT
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      const maxHeight = 150; // Đặt chiều cao tối đa là 150px
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // Hiển thị thanh cuộn dọc khi vượt quá chiều cao tối đa
      } else {
        textarea.style.overflowY = "hidden"; // Ẩn thanh cuộn dọc khi chiều cao dưới tối đa
      }
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      setUserInput("");
    }
  };

  return (
    <div className="flex">
      {/* <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden">
        <button
          type="button"
          className={`-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center outline-none justify-center rounded-md focus:ring-1 focus:ring-white ${
            !show && "!ring-0"
          } dark:hover:text-white text-gray-100`}
          onClick={() => setShow(!show)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon />
        </button>
        <h1 className="flex-1 text-center text-base font-normal">New chat</h1>
        <button type="button" className="px-3">
          <PlusIcon className="h-6 w-6" />
        </button>
      </div> */}

      {/* Left Section */}
      <div className="w-1/6">
        <LeftSection
          conversations={conversationList}
          refresh={getConversationLists}
        />
      </div>

      {/* Right Section */}
      <div className="w-5/6">
        <RightSection
          /*setQuestionData={setQuestionData}
        call={call}
        listQuestion={listQuestion}*/
          userInput={userInput}
          chatHistory={chatHistory}
          setUserInput={setUserInput}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          setChatHistory={setChatHistory}
          handleUserInput={sendMessage}
          isBotReplying={isBotReplying}
          isProcessing={isProcessing}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}
