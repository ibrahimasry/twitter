import React from "react";
import NavLink from "./navLink";

export default function UserTweets(props) {
  return (
    <div>
      <ul className="flex space-x-2 p-2">
        <ListItem>
          <NavLink end to="">
            Tweets
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to={`likes`} partial>
            Likes{" "}
          </NavLink>
        </ListItem>

        <ListItem>
          <NavLink to={`media`} partial>
            media{" "}
          </NavLink>
        </ListItem>
      </ul>
      {props.children}
    </div>
  );
}

export function ListItem({ children }) {
  return (
    <li className="p-2 text-neutral transition-all ease-in">{children}</li>
  );
}
