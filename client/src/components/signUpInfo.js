import TextInput from "./input";
import React from "react";
import DatePicker from "./datePicker";

export default function SignUpInfo(props) {
  const {
    formField: { name, email, password },
  } = props;
  return (
    <div className="space-y-2">
      <TextInput name={name.name} label={name.label}></TextInput>
      <TextInput name={email.name} label={email.label}></TextInput>
      <TextInput name={password.name} label={password.label}></TextInput>

      <DatePicker></DatePicker>
    </div>
  );
}
