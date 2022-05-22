import {ErrorResponse} from "../errorHandler.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import sendEmail from "../mail.js";
export const login = async (req, res) => {
  const {username, password} = req.body;
  const email = username;

  if ([email, password].some((curr) => curr.trim().length == 0))
    throw new ErrorResponse("please provide valid data !", "all", 403);
  const user = await User.findOne({
    $or: [{username}, {email}],
  });

  if (!user)
    throw new ErrorResponse("email , username and password arent matching ");

  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) return res.status(404).json({message: "password is wrong"});
  req.session.regenerate(function (err) {
    if (err) next(err);

    req.session.user = user._id;
    res.json({user});
  });
};

export const signup = async ({body}, res) => {
  const birthDate = body.year + "-" + body.month + "-" + body.day;
  const verificationExpiry = Date.now() + 1000 * 60 * 10;
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  let dup = await User.findOne({email: body.email});
  if (dup) throw new ErrorResponse("email already exits", "email", 401);

  await User.create({
    name: body.name,
    email: body.email,
    birthDate,
    password: body.password,
    verificationCode,
    verificationExpiry,
  });
  const html = `<span> code to verfiy your account : ${verificationCode} </span>`;
  await sendEmail({to: body.email, subject: "account verificaton", html});
  return res.json({success: true});
};

export const verfiy = async ({body}, res) => {
  const {email} = body;
  if (body.code) {
    let user = await User.findOne({email});
    if (user) {
      if (
        user.verificationCode === body.code &&
        Date.now() < user.verificationExpiry
      ) {
        user.verified = true;
        user.verificationCode = undefined;
        user.verificationExpiry = undefined;
        const result = await user.save();
        res.json({user: result});
      } else throw new ErrorResponse("code is wrong", "code", 401);
    }
  } else {
    throw new ErrorResponse("something went wrong");
  }
};

export const pickUsername = async (req, res, next) => {
  const {
    body: {values},
  } = req;

  let {email, username} = values;
  email = email?.toLowerCase();
  username = username?.toLowerCase();

  const user = await User.findOne({email});
  const dup = await User.findOne({username});
  if (dup) {
    return next(
      new ErrorResponse("username is already taken", "username", 401)
    );
  }

  if (!user)
    return next(new ErrorResponse("no user with this email", "email", 401));
  if (user.verfied == false)
    return next(new ErrorResponse("user should be verfied!", "email", 401));

  user.username = username;
  await user.save();
  req.session.regenerate(function (err) {
    if (err) next(err);

    req.session.user = user._id;
    res.json({user});
  });
};
