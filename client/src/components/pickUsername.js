import TextInput from "./input";
import React from "react";

export default function PickUsername(props) {
  const {
    formField: { username },
  } = props;
  console.log(username);
  return <TextInput name={username.name} label={username.label}></TextInput>;
}
