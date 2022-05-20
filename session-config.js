import pkg from "connect-mongodb-session";

import session from "express-session";

const MongoDBStore = pkg(session);
const isProduction = process.env.PRODUCTION;
const store = MongoDBStore({
  collection: "userSessions",
  uri: process.env.MONGO,
  expires: 10000,
});

const sessionConfig = {
  name: "tweet",
  store,
  secret: "keyboard",
  resave: false,
  saveUninitialized: true,
  key: "sid",

  proxy: true, // add this when behind a reverse proxy, if you need secure cookies
  cookie: {
    sameSite: isProduction ? "none" : false,
    secure: isProduction ? true : false,
    maxAge: 5184000000, // 2 months
    httpOnly: true,
  },
};

export default () => session(sessionConfig);
