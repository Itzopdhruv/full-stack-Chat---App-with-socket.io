import express from "express";
import {
  createGroup,
  getUserGroups,
  addMembersToGroup,
  removeMemberFromGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
  makeAdmin,
  removeAdmin,
  removeMember,
  deleteGroup,
} from "../Controllers/groupController.js";
import protectRoute from "../MiddleWares/secureRoute.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Group management routes
router.post("/create", createGroup);
router.get("/user-groups", getUserGroups);
router.put("/:groupId/add-members", addMembersToGroup);
router.delete("/:groupId/remove-member/:memberId", removeMemberFromGroup);
router.delete("/:groupId/leave", leaveGroup);

// Admin management routes
router.put("/:groupId/make-admin/:memberId", makeAdmin);
router.delete("/:groupId/remove-admin/:memberId", removeAdmin);
router.put("/:groupId/remove-member/:memberId", removeMember);

// Remove group from user's view (for removed members)
router.delete("/:groupId/delete", deleteGroup);

// Group messaging routes
router.get("/:groupId/messages", getGroupMessages);
router.post("/:groupId/send-message", sendGroupMessage);

export default router; 