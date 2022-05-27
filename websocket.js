import * as io from "socket.io";
import User from "./models/user.js";
import Chat from "./models/chat.js";
import { origin } from "./cors-config.js";

export default class WebSocket {
  constructor(app) {
    this.start(app);
  }

  notify() {
    const socket = this.socket;

    socket.on("notify", async (data) => {
      const { content, from, to } = data;
      if (to.toString() !== from.toString())
        socket.to(to).emit("newNoftication", { content, from });
    });
  }

  newTweet() {
    const socket = this.socket;

    socket.on("newTweet", async (data) => {
      let { followers } = await User.findById(socket._id).lean();
      let to = followers.map((follower) => follower.toString());
      if (to.length) socket.to(to).emit("newTweet");
    });
  }

  follow() {
    const socket = this.socket;

    socket.on("follow", async (data) => {
      const { followerId, followingId, isFollowing } = data;
      socket
        .to(followerId.toString())
        .emit("follow", { followingId, followingId, isFollowing });
    });
  }

  message() {
    const self = this;
    const socket = this.socket;
    socket.on("message", async (data) => {
      const { userId, chatId, message } = data;
      const chat = await Chat.findOne({ _id: chatId, members: userId }).lean();
      if (!chat) return;
      chat.members = chat.members.map(String);

      const members = new Set(chat.members);
      members.delete(userId);
      for (let [id, socket] of self.currSocketServer.of("/").sockets) {
        if (members.has(socket._id)) {
          members.delete(socket._id);
          socket.to(socket._id).emit("message", { chatId });
        }
      }
    });
  }

  newLike() {
    const socket = this.socket;
    socket.on("newLike", async (value) => {
      let data = await User.findById(value.userId).select("follower").lean();

      let followers = data.followers?.map((follower) => follower.toString());
      socket.to(followers).emit("newLike", { tweetId: value.tweetId });
    });
  }

  start(app) {
    const self = this;
    self.currSocketServer = new io.Server(app, {
      cors: { credentials: true },
    });
    this.handshakeMiddleware(self.currSocketServer);
    self.currSocketServer.on("connection", self.onConnnection());
  }

  handshakeMiddleware(currSocketServer) {
    const self = this;
    currSocketServer.use((socket, next) => {
      if (socket.handshake.auth._id) {
        socket._id = socket.handshake.auth._id;
        socket.username = socket.handshake.auth.username;
      }
      self.socket = socket;
      next();
    });
  }

  onConnnection() {
    const self = this;
    return (socket) => {
      socket.join([socket._id?.toString(), socket.username, "users"]);
      console.log("NEW connection", socket.username);
      self.notify();
      self.follow();
      self.message();
      self.newLike();
      self.newTweet();
      socket.on("disconnect", () => {
        socket.leave(["users", socket.username, socket._id]);
        console.log("disconnection");
      });
    };
  }
}
