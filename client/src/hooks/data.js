import { queryClient } from "react-query";
const tweet = {
  likes: Math.floor(Math.random() + 3000),
  retweets: Math.floor(Math.random() + 3000),
  isLiked: true,
  text: "hey you what'up man are you doing good?",
  name: "ibrahim",
  username: "hema",
  img:
    "https://pbs.twimg.com/card_img/1516763036501307398/bht7bpYx?format=jpg&name=small",
};
let data = Array(40)
  .fill({})
  .map((curr, i) => ({ ...tweet, i }));
export default data.map((curr) => (curr.replies = data));
