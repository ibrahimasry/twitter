import "./dotenv.js";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import path from "path";
import db from "./database.js";
import User from "./models/user.js";
import {corsOptionsProducation} from "./cors-config.js";
import session from "./session-config.js";
import {errorHandler, ErrorResponse} from "./errorHandler.js";
import {userRouter} from "./routes/user-route.js";
import {tweetsRouter} from "./routes/tweets-route.js";
import {usersRouter} from "./routes/users-route.js";
import {authRouter} from "./routes/auth-route.js";
import {chatRouter} from "./routes/chat-route.js";
import WebSocket from "./websocket.js";
import morgan from "morgan";
import {getCurrentUser} from "./controller/userController.js";
import {catchError} from "./helpers.js";
import "./models/Notificaton.js";
import "./models/chat.js";

const app = express();

//mailInit();
app.set("trust proxy", 1); // trust first proxy

app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session());

app.use(async (req, res, next) => {
  if (req.session?.user == false) {
    return next();
  }
  req.user = await User.findById(req.session.user);
  return next();
});

if (true || process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

db();
// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(path.resolve(), "/client/build")));

app.use("/user", userRouter);
app.use("/tweets", tweetsRouter);
app.use("/users", usersRouter);
app.use("/", authRouter);
app.use("/", chatRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "client", "build", "index.html"));
});

let server = http.createServer(app);
new WebSocket(server);

app.use(errorHandler);

server.listen(process.env.PORT || 8080);
