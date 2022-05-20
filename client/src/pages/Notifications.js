import React from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import {useGetNotifications} from "../util/api";

export default function Notifications() {
  const notifications = useGetNotifications();
  function getContent(str, i) {
    const regex = /@[a-z]+/g;
    const textArray = str.split(regex);
    const matching = str.matchAll(regex);
    return textArray.map((curr, j) => {
      const {value} = matching.next();
      if (value) {
        curr = value[0];
        return (
          <Link key={i + "" + j} to={"/" + curr.slice(1)}>
            <span className="font-semibold text-blue">{curr}</span>
          </Link>
        );
      }
      return <span key={i + "" + j}>{curr}</span>;
    });
  }
  return (
    <>
      <Header goBack={true} title={"Notifications"}></Header>
      <div className="flex flex-col space-y-2 p-2 text-xs">
        {notifications &&
          notifications.map((curr, i) => (
            <span key={i} className="shadow-light-grey shadow-sm p-2 ">
              {" "}
              {getContent(curr.content, i)}
            </span>
          ))}
      </div>
    </>
  );
}
