import openSocket from "socket.io-client";
export const socket = openSocket(process.env.REACT_APP_SERVER_URL);
