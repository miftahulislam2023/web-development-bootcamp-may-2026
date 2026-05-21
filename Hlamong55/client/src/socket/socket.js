import { io } from "socket.io-client";

const socket = io("https://mern-live-chat-api.up.railway.app");

export default socket;