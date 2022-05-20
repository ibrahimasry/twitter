import React, {useState} from "react";
import {at} from "lodash";
import {useField} from "formik";

export default function TextInput(props) {
  const [field, meta] = useField(props);
  const [focus, setFocus] = useState(false);

  function _renderHelperText() {
    const [touched, error] = at(meta, "touched", "error");
    if (touched && error) {
      return <span className="block text-xs text-red-500 italic">{error}</span>;
    }
  }
  const onFocusHandler = (e) => {
    setFocus(true);
  };
  const onBlurHandler = (e) => {
    field.onBlur(e);
    setFocus(false);
  };

  const onFocusStyle = () => {
    const [touched, error] = at(meta, "touched", "error");
    let value = "";
    if (focus || (touched && !error) || field.value)
      value += " text-xs font-bold";
    else value += " text-lg";
    if (error) value += " text-red-200";
    if (error && field.value) value += " font-bold";
    else if (!error) value += " text-blue-200 ";
    return value;
  };
  return (
    <>
      <label className="relative block">
        <input
          {...field}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          type="text"
          className="block relative w-9/12 p-1 py-2  border-solid border-secondary border-2 outline-none  peer focus:bg-secondary "
        />
        <span
          className={`absolute h-full top-0 flex justify-center left-0 z-20 font-extrabold ${onFocusStyle()} ${
            focus ? "items-start" : "items-center"
          }}`}
        >
          {props.label}
        </span>
      </label>
      {_renderHelperText()}
    </>
  );
}
