import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryClient } from "../AppProvider";
import { useAuth } from "../useAuth";
import { socket } from "../authApp";
const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api/"
    : "https://twitter-bfo8.onrender.com/api";
const client = axios.create({
  baseURL,
  withCredentials: true,
});

export async function loginRequest(data) {
  const res = await client.post("/login", { ...data });
  if (res.status == 200) window.location.pathname = "/";

  return res;
}

export async function logoutRequest() {
  const res = await client.post("/logout");
  if (res.status == 200) window.location.pathname = "/";
  await queryClient.invalidateQueries("getUser");
  return res;
}

export async function signUpRequest(data) {
  let res = await client.post("/signup", { ...data });
  return res;
}

export async function verifyRequest(data) {
  const res = await client.post("/verify", { ...data });
  return res;
}
export async function getUser(data) {
  const res = await client.get("/user");
  return res?.data?.user;
}

export async function getProfile({ username }) {
  const res = await client.get("/user/" + username);
  return res?.data?.user;
}

export function useGetNotifications() {
  const request = async () => {
    const res = await client.get("/user/notifications");
    return res?.data.notifications;
  };
  const res = useQuery("getNotifications", request);
  return res.data;
}

export async function getProfileLikes({ pageParam = 0, username }) {
  const res = await client.get(
    "/user/" + username + "/likes?page=" + pageParam
  );
  return res?.data;
}
export async function getProfileTweets({ username, filter, pageParam = 0 }) {
  let URL = `/user/${username}/tweets?page=${pageParam}`;
  if (filter) URL += `&search=${filter}`;

  const res = await client.get(URL);
  return res?.data;
}

export async function searchUsers(data) {
  const res = await client.get(`/users?search=${data}`);

  return res.data.data;
}

export async function postTweet(data) {
  console.log(data);
  const res = await client.post("/tweets", data);
  await queryClient.invalidateQueries("getProfileLikes");
  await queryClient.invalidateQueries("getProfileTweets");
  await queryClient.refetchQueries("getTimeLine");

  return res;
}

export function useDeleteTweet({ _id }) {
  const user = useAuth();
  const deleteTweet = async () => {
    await client.delete("/tweets/" + _id);

    Promise.all([
      queryClient.invalidateQueries(["getTweet", _id]),
      queryClient.invalidateQueries("getTimeLine"),
      queryClient.invalidateQueries(["getProfileLikes", user.username]),
      queryClient.invalidateQueries(["getProfileTweets"]),
    ]);
  };

  const { mutate, isLoading, isError } = useMutation(
    "deleteTweet",
    deleteTweet
  );

  return { mutate, isLoading, isError };
}

export async function getChats(data) {
  const res = await client.get("/chats");
  return res.data.chats || [];
}
export async function getChat(data) {
  if (!data) return {};
  const res = await client.get("/chat/" + data);

  return res.data?.data || {};
}

export async function postMessage({ text, chatId }) {
  if (text.trim().length == 0) return;

  const res = await client.post("/message", { text, chatId });

  await queryClient.refetchQueries("getChat");
  await queryClient.refetchQueries("getChats");
  return res;
}

export async function createChat(data) {
  const res = await client.post("/chat", { members: data });

  queryClient.invalidateQueries("getChats");
  return res;
}

export async function getTweets() {
  const res = await client.get("/user/tweets");

  return res?.data?.data || [];
}
export async function getLikes() {
  const res = await client.get("/user/likes");
  return res?.data?.data || [];
}

export async function getTweetLikes({ _id, pageParam }) {
  const res = await client.get(`/tweets/${_id}/likes?page=${pageParam || 0}`);
  return res?.data || [];
}

export async function getTweetRetweets({ _id, pageParam }) {
  const res = await client.get(
    `/tweets/${_id}/retweets?page=${pageParam || 0}`
  );
  return res?.data || [];
}

export async function getFollowers({ _id, pageParam }) {
  const res = await client.get(
    `/user/profile/${_id}/followers?page=${pageParam || 0}`
  );
  return res?.data || [];
}
export async function getFollowings({ _id, pageParam }) {
  const res = await client.get(
    `/user/profile/${_id}/followings?page=${pageParam || 0}`
  );
  return res?.data || [];
}

export async function getTimeLine({ pageParam = 0 }) {
  const res = await client.get("/tweets?page=" + pageParam || 0);
  return res?.data || [];
}

export async function getHashTagTimeLine({ pageParam = 0, hashtag }) {
  const res = await client.get(
    `/tweets/hashtag/${hashtag}?page=${pageParam || 0}`
  );
  return res?.data || [];
}

export async function getSearchTimeLine({ pageParam = 0, query }) {
  const res = await client.get(
    `/tweets/search?query=${query}&page=${pageParam}`
  );
  return res?.data || [];
}

export async function getUsernameRequest(values) {
  const res = await client.post("/username", { values });
  if (res.status == 200)
    window.location.pathnamepathname = res.data?.username + "/profile";
  return res?.data?.username || "";
}

export async function getSuggestionRequest(values) {
  const res = await client.get("/users/suggest");
  return res;
}

export function useFollowMutation({ username, _id }) {
  let user = useAuth();
  let currUser = user && user.username;
  const followUserRequest = async () =>
    await client.post("/users/follow", { _id });
  const { mutate } = useMutation(
    followUserRequest.name,
    () => followUserRequest({ username, _id }),
    {
      onSuccess: async ({ data }) => {
        await queryClient.invalidateQueries("getSuggestion");
        await queryClient.refetchQueries(["getProfile", username]);
        await queryClient.refetchQueries(["getProfile", currUser]);

        socket.emit("follow", data);
      },
    }
  );

  if (currUser == undefined)
    return {
      mutate() {
        window.location.pathname = "/";
      },
    };

  return { mutate };
}

export async function getTweetRequest(_id) {
  const res = await client.get("/tweets/" + _id);
  return res?.data?.tweet;
}

export async function postReplyRequest(values) {
  const res = await client.post("/tweets/" + values.tweetId.toString(), values);
  await queryClient.refetchQueries(["getTweet", values.tweetId]);
  return res;
}
export async function postQuoteRequest(values) {
  return await client.post(
    "/tweets/" + values.tweetId.toString() + "/quote",
    values
  );
}

export function usePostLike({ tweet, willLike }, onMutate) {
  const user = useAuth();
  tweet = tweet.isRetweet ? tweet.retweetData : tweet;
  const tweetId = tweet._id;
  const apiCall = async () =>
    await client.post("/tweets/" + tweetId.toString() + "/like");
  const { mutate: likeMutate } = useMutation("usePostLike", apiCall, {
    onSuccess: async () => {
      const notifyUser = willLike;

      Promise.all([
        queryClient.invalidateQueries(["getTweet", tweetId]),
        queryClient.invalidateQueries("getTimeLine"),
        queryClient.invalidateQueries(["getProfileLikes", user.username]),
        queryClient.invalidateQueries(["getProfileTweets", user.username]),
      ]);
      if (notifyUser)
        socket.emit("notify", {
          content: `new like`,
          from: user.username,
          to: tweet.owner.username,
        });
    },

    onMutate,
  });
  return likeMutate;
}

export async function postRetweetRequest(values) {
  const res = await client.post("/tweets/" + values.tweetId + "/retweet");
  await queryClient.refetchQueries("getTimeLine");
  await queryClient.refetchQueries(["getTweet", values.tweetId]);
  await queryClient.invalidateQueries("getProfileTweets");
  // socket.emit("notify", {
  //   content: `your tweet got new retweet`,
  //   from: user.username,
  //   to: tweet.owner.username,
  // });

  return res;
}

export async function postProfileInfo(values) {
  const res = await client.post("/user/profile", values);
  return res;
}

export async function getTrends() {
  const res = await client.get("/tweets/trend");
  return res;
}
