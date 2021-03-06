import React, { useState, useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import { socket } from "../socket";

const Header = styled.header`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PeopleIcon = styled.i`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const People = styled.div`
  position: absolute;
  color: white;
  right: 1rem;
  font-weight: 900;
  font-size: 1.5rem;
`;

const HeaderTitle = styled.div`
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.5rem;
  padding: 1rem;
  color: white;
`;

const ChatForm = styled.form`
  width: 100%;
  height: 50px;
  justify-self: flex-end;
  border: 3px solid black;
  display: grid;
  grid-template-columns: 10fr 1fr;
  position: absolute;
  bottom: 0px;
`;

const MessageInput = styled.input`
  padding: 0 1rem;
`;

const SubmitBtn = styled.input`
  cursor: pointer;
  box-shadow: -3px 0px 19px 0px #3c3c3c;
  font-weight: 900;
  color: white;
  background-color: #fbab7e;
  background-image: linear-gradient(62deg, #fbab7e 0%, #f7ce68 100%);
`;

const ChatList = styled.ul`
  width: 100%;
  overflow-y: auto;
  padding: 0.5rem 2rem;
  position: absolute;
  top: 50px;
  bottom: 50px;
`;

interface IChatMessageProps {
  type: "chat" | "noti" | "yours";
}

const ChatMessage = styled("li")<IChatMessageProps>`
  font-size: 1rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.type === "noti"
      ? "center"
      : props.type === "chat"
      ? "flex-start"
      : "flex-end"};
  animation-name: ${props =>
    props.type === "noti"
      ? "fadeInFromBottom"
      : props.type === "chat"
      ? "fadeInFromLeft"
      : "fadeInFromRight"};
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
`;

interface IChatContainerProps {
  type: "chat" | "noti" | "yours";
}

const ChatContainer = styled("div")<IChatContainerProps>`
  display: inline-flex;
  padding: 0.5rem;
  color: black;
  background-color: white;
  border-radius: 10px;
  border-top-right-radius: ${props =>
    props.type === "yours" ? "0px" : undefined};
  border-top-left-radius: ${props =>
    props.type === "chat" ? "0px" : undefined};
`;

const Name = styled.span`
  font-weight: 900;
  white-space: pre;
`;

const Message = styled.div``;

interface IChatMessage {
  type: "chat" | "noti" | "yours";
  name: string;
  message: string;
}

function Chat({ name }: any) {
  const [messages, setMessages] = useReducer((messages, { type, value }) => {
    switch (type) {
      case "add":
        return [...messages, value];
      case "remove":
        return messages.filter((_: any, index: number) => index !== value);
      default:
        return messages;
    }
  }, []);
  const [message, setMessage] = useState("");
  const [userNum, setUserNum] = useState(0);

  const handleGetNewMessage = (data: any) => {
    const { type, name, message } = data;
    setMessages({ type: "add", value: { type, name, message } });
    scrollToBottom();
  };

  const handleGetUserNumber = (data: any) => {
    const { userNum } = data;
    setUserNum(userNum);
  };

  useEffect(() => {
    socket.emit("new user", name);
    socket.on("get user number", handleGetUserNumber);
    socket.on("get new message", handleGetNewMessage);
    return () => {
      socket.removeAllListeners();
    };
  }, []);
  const messagesEnd: any = useRef({});
  const scrollToBottom = () => {
    messagesEnd.current.scrollTo({
      top: messagesEnd.current.scrollHeight,
      behavior: "smooth"
    });
  };
  return (
    <>
      <Header>
        <HeaderTitle>🔥 bonfire.io 🔥</HeaderTitle>
        <People>
          <PeopleIcon className="far fa-user" />
          <span>{userNum}</span>
        </People>
      </Header>
      <ChatList ref={messagesEnd}>
        {messages.map((message: IChatMessage, index: number) => (
          <ChatMessage type={message.type} key={index}>
            <ChatContainer type={message.type}>
              {message.type !== "yours" && <Name>{message.name}</Name>}
              <Message>{message.message}</Message>
            </ChatContainer>
          </ChatMessage>
        ))}
      </ChatList>
      <ChatForm
        onSubmit={(e: any) => {
          e.preventDefault();
          const postMessage = message.trim();
          if (postMessage) {
            const { id } = socket;
            socket.emit("post message", { name, message, id });
            setMessage("");
          }
        }}
      >
        <MessageInput
          type="text"
          name="message"
          autoFocus
          value={message}
          placeholder="🙋‍♂️ 당신의 이야기를 들려주세요"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <SubmitBtn type="submit" value="보내기" />
      </ChatForm>
    </>
  );
}

export default Chat;
