import {Router} from "express";
import {
  login,
  pickUsername,
  signup,
  verfiy,
} from "../controller/authController.js";
import {catchError} from "../helpers.js";

export const authRouter = Router();
authRouter.post("/verify", catchError(verfiy));

authRouter.post("/login", catchError(login));

authRouter.post("/logout", function (req, res) {
  req.session.destroy(function (err) {
    // cannot access session here
    res.json({messaga: "logged out"});
  });
});
authRouter.post("/signup", catchError(signup));

authRouter.post("/username", catchError(pickUsername));
