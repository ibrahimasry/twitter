import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export const getChat = async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate("messages")
    .populate({
      path: "messages",
      populate: {path: "sender"},
      match: {isRead: false},
    })
    .populate("members");

  return res.json({data: chat});
};

export const getChats = async (req, res) => {
  let {chats} = await User.findById(req.user._id)
    .populate({
      path: "chats",
      populate: {
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      },
    })
    .populate({
      path: "chats",
      populate: {
        path: "members",
      },
    })
    .lean();
  //mongoose doesnt sort by sub document value
  chats.sort((chat1, chat2) => {
    return new Date(chat1.lastMessage?.createdAt).getTime() <
      new Date(chat2.lastMessage?.createdAt).getTime()
      ? 1
      : -1;
  });
  res.json({chats: chats});
};

export const createChat = async (req, res) => {
  let {members} = req.body;

  members = [req.user._id.toString(), ...members];
  let chat = await Chat.findOne({
    members: {$size: members.length, $all: members},
  });
  if (chat) return res.json({chatId: chat._id.toString()});
  chat = await Chat.create({
    createdBy: req.user._id,
    members,
  });
  Promise.all([]);
  await User.updateMany({_id: {$in: members}}, {$push: {chats: chat._id}});
  res.json({chatId: chat._id.toString()});
};

export const sendMessage = async (req, res) => {
  const {text, chatId, recievers = []} = req.body;
  let chat;
  const message = await Message.create({
    text: text,
    chat: chatId,
    sender: req.user._id,
  });
  chat = await Chat.findByIdAndUpdate(chatId, {
    $push: {
      messages: message._id,
    },
    lastMessage: message._id,
  });

  res.json({data: chat});
};
