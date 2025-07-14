import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Not required for group messages
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false, // Not required for direct messages
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;