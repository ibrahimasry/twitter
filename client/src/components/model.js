import {Dialog} from "@reach/dialog";
import {useRef} from "react";
import "@reach/dialog/styles.css";
import SignUp from "./signUp";
import React from "react";
import {BsX} from "react-icons/fa";
import {BsXDiamondFill} from "react-icons/bs";
import {AiOutlineClose} from "react-icons/ai";

export default function Model({close, label, style, showDialog, children}) {
  const buttonRef = useRef(null);

  return (
    <Dialog
      initialFocusRef={null}
      aria-label={label}
      isOpen={showDialog}
      onDismiss={close}
      style={{
        ...style,
      }}
    >
      {children}
      <button
        ref={buttonRef}
        className="absolute top-2 left-2 font-bold"
        onClick={close}
      >
        <AiOutlineClose></AiOutlineClose>
      </button>
    </Dialog>
  );
}
