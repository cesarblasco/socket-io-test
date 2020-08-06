const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("client"));

app.get("/hello-world", (req, res) => {
  res.status(200).send("Hello world from a route =)");
});

const messages = [
  {
    id: 1,
    text: "Welcome to the private chat with Socket.io and NodeJS",
    nickname: "Bot - Cesarblasco",
  },
];

io.on("connection", (socket) => {
  console.info(
    `The client with ID [id=${socket.id}] / IP: ${socket.handshake.address} has connected`
  );
  socket.emit("messages", messages);

  socket.on("add-message", (data) => {
    messages.push(data);
    io.sockets.emit("messages", messages);
  });

  socket.on("get-message-from-server", () => {
    const randomString = `This is a message with a random numeric value ---> ${
      Math.random() * 100
    }`;

    setTimeout(() => {
      console.log("MESSAGE SENT THERE YA GO");
      io.to(socket.id).emit("send-message-from-server", randomString);
    }, 7000);
  });

  socket.on("disconnect", () => {
    console.info(`Client gone [id=${socket.id}]`);
  });
});

server.listen(6677, () => {
  console.log("Hey there, the server is up at http://localhost:6677");
});
