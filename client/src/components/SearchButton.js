import React, {useEffect, useState} from "react";
import {BsSearch} from "react-icons/bs";

export default function SearchButton({onKeyHandler: search}) {
  const [value, setValue] = useState("");
  const onKeyHandler = (e) => {
    if (e.key == "Enter" || e.code == 13) {
      search(e, value);
      setValue("");
    }
  };

  useEffect(() => {
    window.document.addEventListener("keydown", onKeyHandler);
    return () => window.document.removeEventListener("keydown", onKeyHandler);
  });
  return (
    <span className="flex items-center relative" onKeyDown={onKeyHandler}>
      <BsSearch className="absolute left-2"></BsSearch>

      <input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="rounded-3xl focus:border-2 px-8 py-2 outline-none w-40 focus:w-60  transition-all "
      />
    </span>
  );
}
