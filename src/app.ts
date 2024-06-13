import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import faceBookRouter from "./routes/facebookRoutes";


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
  session({
    secret: `${process.env.APP_KEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", faceBookRouter);

export const supabase = createClient(
  `${process.env.DATABASE_URL}`,
  `${process.env.PUBLIC_KEY}`
);

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

app.listen(process.env.PORT, () => {
  console.log(`server running on Port ${process.env.PORT}`);
});
