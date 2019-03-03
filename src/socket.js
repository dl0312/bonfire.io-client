import openSocket from "socket.io-client";
console.log(process.env);
export const socket = openSocket(process.env.REACT_APP_SERVER_URL);
