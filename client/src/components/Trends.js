import React from "react";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";
import {getTrends} from "../util/api";

function Trends() {
  const {data} = useQuery("getTrend", getTrends);
  const trends = data?.data || [];

  return (
    <div>
      {trends.length ? (
        <span className="text-sm">trending now </span>
      ) : (
        <span className="text-sm">no trending right now</span>
      )}
      {trends.map(({content, tweetsCount}) => (
        <span
          key={content}
          className="p-2 flex space-x-2  text-sm text-extra-light-grey font-semibold"
        >
          <Link to={"/tweets/hashtag/" + content} className="text-dark-grey">
            #{content}
          </Link>
          <span className="text-extra-light-grey">{tweetsCount}</span>
        </span>
      ))}
    </div>
  );
}

export default Trends;
