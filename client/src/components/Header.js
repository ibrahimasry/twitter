import {BackdropRoot} from "@mui/material";
import React from "react";
import {BsBack} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {GoBack} from "../icons";
import SearchButton from "./SearchButton";

export default function Header({title, goBack}) {
  const navigate = useNavigate();
  const onKeyHandler = (e, value) => {
    return navigate("/tweets/search?query=" + value);
  };
  return (
    <div className="col-span-1 space-x-2 p-2 md:p-6 flex items-center">
      {goBack && (
        <GoBack
          onClick={() => {
            "should go back";
            navigate(-1);
          }}
        >
          {" "}
        </GoBack>
      )}
      <span className="font-bold"> {title}</span>

      <SearchButton onKeyHandler={onKeyHandler}></SearchButton>
    </div>
  );
}
