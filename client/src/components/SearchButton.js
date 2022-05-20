import React, {useState} from "react";
import {BsSearch} from "react-icons/bs";

export default function SearchButton({onKeyHandler}) {
  const [value, setValue] = useState("");
  return (
    <span
      className="flex items-center relative"
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          onKeyHandler(e, value);
          setValue("");
        }
      }}
    >
      <BsSearch className="absolute left-2"></BsSearch>

      <input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="rounded-3xl px-8 py-2 outline-none w-40 focus:w-60  transition-all "
      />
    </span>
  );
}
