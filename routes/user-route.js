import {Router} from "express";
import {
  editCurrProfile,
  getCurrentUser,
  getCurrentUserNotification,
  getFriendshipData,
  getUserInfo,
  getUserLikes,
  getUserTweets,
} from "../controller/userController.js";
import {catchError, isAuth, isAutharized} from "../helpers.js";

export let userRouter = Router();

userRouter.post("/profile", isAuth, catchError(editCurrProfile));

userRouter.get("/profile/:id/:path", catchError(getFriendshipData));

userRouter.get("/notifications", catchError(getCurrentUserNotification));

userRouter.get("/", catchError(getCurrentUser));

userRouter.get("/:username", catchError(getUserInfo));
userRouter.get("/:username/tweets", catchError(getUserTweets));

userRouter.get("/:username/likes", catchError(getUserLikes));
