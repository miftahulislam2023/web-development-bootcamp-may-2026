const Message = require("../models/Message");
const User = require("../models/User");

const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUserId =
        msg.senderId.toString() === userId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (conversationMap.has(otherUserId)) {
        continue;
      }

      const otherUser = await User.findById(otherUserId);

      const unreadCount = await Message.countDocuments({
        senderId: otherUserId,
        receiverId: userId,
        seen: false,
      });

      conversationMap.set(otherUserId, {
        user: otherUser,
        latestMessage: msg.text,
        latestMessageSender: msg.senderId,
        latestMessageTime: msg.createdAt,
        unreadCount,
      });
    }

    res.status(200).json({
      success: true,

      conversations: Array.from(conversationMap.values()),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getConversations,
};
