import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import faceBookRouter from "./routes/facebookRoutes";
import { scheduler } from "./utilities/scheduler";
import { APP_KEY, DATABASE_URL, PUBLIC_KEY, PORT } from './keys';
import http from 'http';
import { Server } from 'socket.io';
import { sendMessages } from "./controllers/userControllers/sendMessages";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

dotenv.config();

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
  session({
    secret: APP_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 60000 // Adjust as needed
    }
  })
);

app.use("/", faceBookRouter);

scheduler();

export const supabase = createClient(DATABASE_URL, PUBLIC_KEY);

const checkConnection = async () => {
  const { error } = await supabase.from("users").select("id").limit(1);

  if (error) {
    console.error("Failed to connect to Supabase:", error.message);
    process.exit(1);
  } else {
    console.log("Successfully connected to Supabase");
  }
};

checkConnection();

app.get("/", (request: Request, response: Response) => {
  response.send("Server Hosted Successfully");
});

// Handle new connections to the websocket
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", (data) => {
    console.log("Received message:", data);

    // Process the message and send it to the intended recipient
    const recipientId = data.userId;
    const messageText = data.message;

    sendMessages(messageText, recipientId).then((response:any) => {
        console.log(`Message sent to ${recipientId}:`, response);
        io.emit("newMessage", data.message);
      })
     .catch((error:any) => {
        console.error(`Error sending message to ${recipientId}:`, error);
      });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export const emitMessage = (message: any) => {
  io.emit("newMessage", message);
};

server.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});
