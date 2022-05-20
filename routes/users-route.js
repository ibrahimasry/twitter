import {Router} from "express";
import {
  getFollowSuggestions,
  searchUsers,
  toggleFollowing,
} from "../controller/usersController.js";
import {catchError} from "../helpers.js";

export let usersRouter = Router();

usersRouter.post("/follow", catchError(toggleFollowing));
usersRouter.get("/suggest", catchError(getFollowSuggestions));

usersRouter.get("/", catchError(searchUsers));
