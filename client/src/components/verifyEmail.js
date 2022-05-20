import TextInput from "./input";
import React from "react";

export default function Verfiy(props) {
  const {
    formField: {code},
  } = props;

  return (
    <>
      <TextInput name={code.name} label={code.label}></TextInput>
      <span className="text-xs text-green-400 ">
        code should be sent to your email
      </span>
    </>
  );
}
