import {Router} from "express";
import {
  getFollowSuggestions,
  searchUsers,
  toggleFollowing,
} from "../controller/usersController.js";
import {catchError, isAuth} from "../helpers.js";

export let usersRouter = Router();

usersRouter.post("/follow", isAuth, catchError(toggleFollowing));
usersRouter.get("/suggest", catchError(getFollowSuggestions));

usersRouter.get("/", catchError(searchUsers));
