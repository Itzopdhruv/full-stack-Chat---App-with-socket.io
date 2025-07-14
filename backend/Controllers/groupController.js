import Group from "../Models/groupModel.js";
import Message from "../Models/messageModel.js";
import Conversation from "../Models/chatModel.js";
import { getReceiverSocketId, io, joinUserToGroups } from "../SocketIo/socket.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const adminId = req.user._id;

    if (!name || !members || members.length < 2) {
      return res.status(400).json({ error: "Group name and at least 2 members are required" });
    }

    // Add admin to members if not already included
    const allMembers = members.includes(adminId) ? members : [...members, adminId];

    const group = await Group.create({
      name,
      description,
      admin: adminId,
      admins: [adminId], // Add creator as first admin
      members: allMembers,
    });

    // Create conversation for the group
    await Conversation.create({
      members: allMembers,
      groupId: group._id,
      isGroupChat: true,
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("members", "fullname email photo")
      .populate("admins", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.log("Error in createGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all groups for a user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({
      $or: [
        { members: userId },
        { removedMembers: userId }
      ]
    })
      .populate("members", "fullname email photo")
      .populate("admins", "fullname email photo")
      .populate("admin", "fullname email photo")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getUserGroups", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add members to group
export const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can add members" });
    }

    // Add new members
    const updatedMembers = [...new Set([...group.members, ...members])];
    group.members = updatedMembers;
    await group.save();

    // Join new members to the group room if they are online
    for (const memberId of members) {
      
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.sockets.sockets.get(socketId)?.join(`group_${groupId}`);
      }
    }

    // Update conversation members
    await Conversation.findOneAndUpdate(
      { groupId },
      { members: updatedMembers }
    );

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in addMembersToGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove member from group
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    if (group.admin.toString() === memberId) {
      return res.status(400).json({ error: "Admin cannot remove themselves" });
    }

    // Remove member
    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();

    // Update conversation members
    await Conversation.findOneAndUpdate(
      { groupId },
      { members: group.members }
    );

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in removeMemberFromGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() === userId.toString()) {
      return res.status(400).json({ error: "Admin cannot leave group. Transfer admin or delete group." });
    }

    // Remove user from members
    group.members = group.members.filter(
      (member) => member.toString() !== userId.toString()
    );
    await group.save();

    // Update conversation members
    await Conversation.findOneAndUpdate(
      { groupId },
      { members: group.members }
    );

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.log("Error in leaveGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Check if user is member or removed member of the group (can view messages)
    const group = await Group.findById(groupId);
    if (!group || (!group.members.includes(userId) && !group.removedMembers.includes(userId))) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await Message.find({
      groupId,
      messageType: "group",
    })
      .populate("senderId", "fullname email photo")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send message to group
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    // Check if user is active member of the group (not removed)
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(senderId)) {
      return res.status(403).json({ error: "Access denied - You are not an active member of this group" });
    }

    const newMessage = new Message({
      senderId,
      groupId,
      message,
      messageType: "group",
    });

    await newMessage.save();

    // Emit to all sockets in the group room (except sender)
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullname email photo");

    io.to(`group_${groupId}`).emit("newGroupMessage", {
      message: populatedMessage,
      groupId,
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Make user admin
export const makeAdmin = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString() && !group.admins.includes(userId)) {
      return res.status(403).json({ error: "Only admins can make other users admin" });
    }

    // Check if member exists in group
    if (!group.members.includes(memberId)) {
      return res.status(400).json({ error: "User is not a member of this group" });
    }

    // Add to admins array if not already there
    if (!group.admins.includes(memberId)) {
      group.admins.push(memberId);
      await group.save();
    }

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullname email photo")
      .populate("admins", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in makeAdmin", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove admin privileges
export const removeAdmin = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only main admin can remove other admins
    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only main admin can remove admin privileges" });
    }

    // Cannot remove main admin
    if (group.admin.toString() === memberId) {
      return res.status(400).json({ error: "Cannot remove main admin privileges" });
    }

    // Remove from admins array
    group.admins = group.admins.filter(adminId => adminId.toString() !== memberId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullname email photo")
      .populate("admins", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in removeAdmin", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove member from group (they can still view messages)
export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString() && !group.admins.includes(userId)) {
      return res.status(403).json({ error: "Only admins can remove members" });
    }

    // Cannot remove main admin
    if (group.admin.toString() === memberId) {
      return res.status(400).json({ error: "Cannot remove main admin" });
    }

    // Remove from members and add to removedMembers
    group.members = group.members.filter(member => member.toString() !== memberId);
    group.admins = group.admins.filter(admin => admin.toString() !== memberId);
    
    if (!group.removedMembers.includes(memberId)) {
      group.removedMembers.push(memberId);
    }
    
    await group.save();

    // Update conversation members
    await Conversation.findOneAndUpdate(
      { groupId },
      { members: group.members }
    );

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullname email photo")
      .populate("admins", "fullname email photo")
      .populate("admin", "fullname email photo");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in removeMember", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove group from user's view (only removed members can do this - like WhatsApp)
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only removed members can remove the group from their view
    if (!group.removedMembers.includes(userId)) {
      return res.status(403).json({ error: "Only removed members can remove the group from their view" });
    }

    // Remove user from removedMembers array (so they can't see the group anymore)
    group.removedMembers = group.removedMembers.filter(memberId => memberId.toString() !== userId.toString());
    await group.save();

    res.status(200).json({ message: "Group removed from your view successfully" });
  } catch (error) {
    console.log("Error in deleteGroup", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 