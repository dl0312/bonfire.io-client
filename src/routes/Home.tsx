import React, { useState, useRef } from "react";
import Login from "./Login";
import Chat from "./Chat";
import styled from "styled-components";
import ReactPlayer from "react-player";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

function Home() {
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [videoStart, setVideoStart] = useState(false);
  const videoRef: any = useRef({});

  return (
    <Container>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=AWKzr6n0ea0&autoplay=1"
        playing={true}
        loop={true}
        controls={false}
        width="100%"
        height="100%"
        onReady={() => console.log("video ready")}
        onStart={() => {
          console.log("video start");
          setTimeout(() => {
            setVideoStart(true);
          }, 2000);
        }}
        onPlay={() => {
          console.log("video play");
          setTimeout(() => {
            setVideoStart(true);
          }, 2000);
        }}
        onError={() => console.log("video error")}
        ref={videoRef}
        style={{
          transition: "3s ease-in-out",
          overflow: "hidden",
          position: "absolute",
          zIndex: -1,
          filter: `blur(2px) brightness(${videoStart ? 0.8 : 0})`
        }}
      />
      {!login ? (
        <Login setLogin={setLogin} name={name} setName={setName} />
      ) : (
        <Chat name={name} />
      )}
    </Container>
  );
}

export default Home;
