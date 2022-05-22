import React, {useEffect, useState, useRef} from "react";
import {BsSearch} from "react-icons/bs";

export default function SearchButton({onKeyHandler: search}) {
  const [value, setValue] = useState("");
  const ref = useRef();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        search(e, value);
        setValue("");
      }}
    >
      <span className="flex items-center relative">
        <BsSearch className="absolute left-2"></BsSearch>

        <input
          ref={ref}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="rounded-3xl border  border-secondary  focus:border-2 p-2 pl-6  outline-none w-40 focus:w-48  transition-all "
        />
      </span>
    </form>
  );
}
