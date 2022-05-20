import {Router} from "express";
import {
  createChat,
  getChat,
  getChats,
  sendMessage,
} from "../controller/chatController.js";
import {catchError} from "../helpers.js";
export const chatRouter = Router();

chatRouter.get("/chat/:id", catchError(getChat));

chatRouter.get("/chats", catchError(getChats));

chatRouter.post("/chat", catchError(createChat));

chatRouter.post("/message", catchError(sendMessage));
