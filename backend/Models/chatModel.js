import mongoose from "mongoose"
import User from "./userModel.js"
import Message from "./messageModel.js";
import Group from "./groupModel.js";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
      required: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Message,
        default: [],
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversation", conversationSchema);
export default Conversation;