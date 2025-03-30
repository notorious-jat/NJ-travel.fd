import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

// Dummy JSON data for questions and answers
const faqData = [
  {
    "question": "What is your name?",
    "answer": "I'm your assistant bot!"
  },
  {
    "question": "What services do you provide?",
    "answer": "I can help you with travel packages, flight, hotels, and sightseeing."
  },
  {
    "question": "How can I book a package?",
    "answer": "Please provide the package details, and I will assist you in booking."
  },
  {
    "question": "Hi",
    "answer": "Hello! How can I assist you today?"
  },
  {
    "question": "Hello",
    "answer": "Hey there! How can I help you today?"
  },
  {
    "question": "How are you?",
    "answer": "I'm just a bot, but I'm doing great! How about you?"
  },
  {
    "question": "Good morning",
    "answer": "Good morning! How can I assist you today?"
  },
  {
    "question": "Good afternoon",
    "answer": "Good afternoon! How's your day going?"
  },
  {
    "question": "Good evening",
    "answer": "Good evening! What can I do for you today?"
  },
  {
    "question": "What time is it?",
    "answer": "I'm unable to check the time, but you can easily check it on your device!"
  },
  {
    "question": "What’s your name?",
    "answer": "I'm your friendly assistant bot. How can I help you today?"
  },
  {
    "question": "What is the weather like?",
    "answer": "I can't check the weather directly, but you can look it up online or use your device’s weather app."
  },
  {
    "question": "What’s the date today?",
    "answer": "Sorry, I don’t know the current date, but you can easily check it on your device!"
  },
  {
    "question": "Tell me a joke",
    "answer": "Why don't skeletons fight each other? They don’t have the guts!"
  },
  {
    "question": "Can you help me with a task?",
    "answer": "Sure! What would you like help with?"
  },
  {
    "question": "What do you do?",
    "answer": "I’m here to assist you with various tasks. How can I help today?"
  },
  {
    "question": "Bye",
    "answer": "Goodbye! Have a great day ahead!"
  },
  {
    "question": "See you later",
    "answer": "See you later! Take care!"
  },
  {
    "question": "How was your day?",
    "answer": "I don’t have days, but I’m happy to help you anytime!"
  },
  {
    "question": "Do you like coffee?",
    "answer": "I can’t drink coffee, but I know it’s loved by many! How about you?"
  },
  {
    "question": "What’s your favorite color?",
    "answer": "I don’t have a favorite color, but I think blue looks nice!"
  },
  {
    "question": "What’s the best movie?",
    "answer": "There are so many great movies! It depends on your taste. What kind of movies do you like?"
  },
  {
    "question": "Tell me something interesting.",
    "answer": "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient tombs that are over 3,000 years old!"
  },
  {
    "question": "What can you do for me?",
    "answer": "I can assist you with a variety of tasks, like booking a travel package, answering questions, or providing information. How can I help you today?"
  },
  {
    "question": "I’m bored",
    "answer": "I'm here to help! How about we talk about something fun, or I can share a joke with you?"
  },
  {
    "question": "Can you remind me something?",
    "answer": "I don't have the ability to set reminders, but I recommend using your phone or a reminder app for that."
  },
  {
    "question": "What should I do today?",
    "answer": "It depends! You could explore new places, try something creative, or relax. What are you in the mood for?"
  },
  {
    "question": "I have some free time, any ideas?",
    "answer": "How about reading a book, learning something new online, or even trying a hobby you’ve always wanted to try?"
  },
  {
    "question": "How can I make my day better?",
    "answer": "Try staying positive, staying hydrated, and doing something you enjoy. How can I help you feel better today?"
  },
  {
    "question": "What do you do in your free time?",
    "answer": "I don’t have free time, but I'm always here to help you with whatever you need!"
  },
  {
    "question": "What’s your favorite food?",
    "answer": "I don't eat food, but I know that pizza, pasta, and sushi are some of the favorites for many people!"
  },
  {
    "question": "Can I talk to you anytime?",
    "answer": "Yes, you can talk to me anytime! I'm available 24/7 to assist you with anything you need."
  },
  {
    "question": "What’s your favorite song?",
    "answer": "I don’t have a favorite song, but many people enjoy listening to genres like pop, rock, and classical. What’s your favorite?"
  },
  {
    "question": "Are you real?",
    "answer": "I’m not a human, but I am real in the sense that I’m here to assist you and help with any questions you might have."
  },
  {
    "question": "Do you understand emotions?",
    "answer": "I don’t feel emotions the way humans do, but I am programmed to understand and respond to your emotions to some extent."
  },
  {
    "question": "Can you cheer me up?",
    "answer": "Of course! Here’s a little joke: Why don’t eggs tell jokes? They’d crack each other up!"
  },
  {
    "question": "Do you have a favorite holiday?",
    "answer": "I don’t celebrate holidays, but I know that Christmas, New Year’s, and Thanksgiving are favorites for many people. Do you have a favorite holiday?"
  },
  {
    "question": "Can you make me laugh?",
    "answer": "I sure can! Here’s another joke: Why don't some couples go to the gym? Because some relationships don't work out!"
  },
  {
    "question": "What should I wear today?",
    "answer": "It depends on the weather and what you're doing! If you need advice on what’s appropriate for an event, let me know!"
  },
  {
    "question": "What are you doing right now?",
    "answer": "I’m here and ready to assist you! What can I do for you today?"
  },
  {
    "question": "How do I get better at something?",
    "answer": "Practice, persistence, and staying focused are key. I can also share tips if you'd like to improve a specific skill!"
  },
  {
    "question": "Do you work for me?",
    "answer": "Yes, I’m here to assist you! Whatever you need, I’ll try to help to the best of my ability."
  }
];


const FilterButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff6347;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ChatBoxWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: ${props => (props.showChat ? "block" : "none")};
  z-index: 1000;
`;

const MessageContainer = styled.div`
  max-height: 350px;
  overflow-y: auto;
  padding: 5px;
`;

const MessageBubble = styled.div`
  background-color: ${props => (props.isUser ? "#f1f1f1" : "#ff6347")};
  color: ${props => (props.isUser ? "#000" : "#fff")};
  padding: 10px;
  margin: 5px 0;
  border-radius: 20px;
  display: inline-block;
  max-width: 70%;
  align-self: ${props => (props.isUser ? "flex-end" : "flex-start")};
  display: flex;
  align-items: center;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => (props.isUser ? "flex-end" : "flex-start")};
  align-items: flex-end;
  margin-bottom: 10px;
`;

const Icon = styled.div`
  width: 30px; /* Reduced size */
  height: 30px; /* Reduced size */
  svg {
    width: 100%;
    height: 100%;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  position: absolute;
  bottom: 5px;
  width: 95%;
`;

const InputField = styled.input`
  width: 80%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const RobotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="20" y="20" width="60" height="60" rx="10" ry="10" fill="#A0A0A0" />
    <circle cx="35" cy="40" r="8" fill="#00BFFF" />
    <circle cx="65" cy="40" r="8" fill="#00BFFF" />
    <rect x="35" y="60" width="30" height="5" rx="2" ry="2" fill="#555" />
    <rect x="45" y="10" width="10" height="10" fill="#555" />
    <circle cx="50" cy="10" r="3" fill="#00BFFF" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 1024 1024" class="icon" version="1.1">
    <path d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z" fill="#4A5699"/>
    <path d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z" fill="#C45FA0"/>
    <path d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z" fill="#E5594F"/>
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15c0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4V9c0-2.21 1.79-4 4-4h10c2.21 0 4 1.79 4 4v6z" />
  </svg>
);

const ChatBot = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your assistant.", isUser: false },
  ]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleFilterChange = async (filters) => {
    try {
      const response = await axios.get("http://localhost:5001/api/travel/filter", {
        params: { name: filters },
      });
      const packages = response?.data?.data || [];
      if (packages.length) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Here are some travel packages:", isUser: false },
          ...packages.map((pkg) => ({
            text: `${pkg.name}: ${pkg.description}`,
            isUser: false,
          })),
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, no packages found.", isUser: false },
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Something went wrong, please try again later.", isUser: false },
      ]);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (!userInput) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, isUser: true },
    ]);

    const faqAnswer = faqData.find((item) =>
      item.question.toLowerCase().includes(userInput.toLowerCase())
    );

    if (faqAnswer) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: faqAnswer.answer, isUser: false },
      ]);
    } else {
      handleFilterChange(userInput);
    }

    setUserInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <FilterButton onClick={() => setShowChat((prev) => !prev)}>
        <ChatIcon />
      </FilterButton>

      <ChatBoxWrapper showChat={showChat}>
        <MessageContainer>
          {messages.map((message, index) => (
            <MessageWrapper key={index} isUser={message.isUser}>
              {!message.isUser && <Icon><RobotIcon /></Icon>}
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
              {message.isUser && <Icon><UserIcon /></Icon>}
            </MessageWrapper>
          ))}
          <div ref={messagesEndRef} />
        </MessageContainer>

        <InputWrapper>
          <InputField
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Ask something..."
          />
          <SendButton onClick={handleSendMessage}>Send</SendButton>
        </InputWrapper>
      </ChatBoxWrapper>
    </>
  );
};

export default ChatBot;
