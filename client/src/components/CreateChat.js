import {debounce} from "lodash";
import React, {useState} from "react";
import DropDown from "./DropDown";

export default function CreateChat(props) {
  const [value, setValue] = useState("");
  return (
    <div>
      <DropDown {...props}></DropDown>
    </div>
  );
}
