import { Server } from "socket.io";
import http from "http";
import express from "express";
import mongoose from "mongoose";
import Group from "../Models/groupModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};

// Helper: join user to all their group rooms
export const joinUserToGroups = async (userId, socket) => {
  if (!userId) return;
  try {
    const groups = await Group.find({ members: userId });
    groups.forEach((group) => {
      socket.join(`group_${group._id}`);
    });
  } catch (err) {
    console.error("Error joining user to groups:", err);
  }
};

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    await joinUserToGroups(userId, socket);
    console.log("Hello ", users);
  }
  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };