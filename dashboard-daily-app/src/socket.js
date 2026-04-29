import { io } from "socket.io-client";

const SOCKET_URL = "http://127.0.0.1:5000"; // Flask backend

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
});

socket.on("connect", () => {
  console.log("Connected to Flask Socket.IO:", socket.id);

  socket.emit("register_device", {
    device_id: "WEB_UI",
    device_type: "react",
    device_name: "Dashboard Web App",
  });
});

socket.on("registration_success", (msg) => {
  console.log("Device registered:", msg);
});

export default socket;
