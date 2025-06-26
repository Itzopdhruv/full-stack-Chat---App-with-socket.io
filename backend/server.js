import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import { app , server } from "./SocketIo/socket.js";

import messageRoute from "./Routes/messageRoute.js"

import userRoute from "./Routes/userRoute.js"
dotenv.config();
connectDB()


app.use(express.json());
app.use(cookieParser());
app.use(cors());





const PORT = process.env.PORT
app.use("/api/user" , userRoute);
app.use("/api/message" , messageRoute);

server.listen(PORT , ()=> {
    console.log("Server is running" , PORT);
})
