// Import npm packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080; // Step 1

//Chat
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
});

//End chat

const routes = require("./routes/api");

require("dotenv").config();

// Step 2
let newUrl =
  "mongodb+srv://ramsess90:Abc123456@cluster0.ewmw7.mongodb.net/db1?retryWrites=true&w=majority";
let oldUrl = "mongodb://localhost/mern_youtube";

if (process.env.MONGODB_URI === undefined) {
  console.log("Not found DB (process.env.MONGODB_URI)!");
}

mongoose.connect(process.env.MONGODB_URI || newUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 3

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// HTTP request logger
app.use(morgan("tiny"));
app.use("/api", routes);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));

//Chat
const PORTCHAT = Number(Number(PORT) + 1);
http.listen(PORTCHAT, () => {
  console.log(`hi chat ${PORTCHAT}`);
});
//End chat
