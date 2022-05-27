import React, { useState } from "react";
import "@reach/listbox/styles.css";
import Model from "../components/model";
import SignUp from "../components/signUp";
import SignIn from "../components/SignIn";
import Button from "../components/shared/Button";
import { Link } from "react-router-dom";

function Registration() {
  const [showDialog, setShowDialog] = React.useState(false);
  const [signInModel, setSignInModel] = useState(false);
  const [signUpModel, setSignUpModel] = useState(false);

  const open = (fn) => {
    setShowDialog(true);
    fn(true);
  };
  const close = (fn) => {
    setShowDialog(false);
    fn(false);
  };

  return (
    <div className="container flex h-screen flex-col md:flex-row space-x-2 mx-auto">
      <div className="h-full order-last md:order-first sm:block basis-7/12 border-solid border-2 border-red">
        <img
          className="h-3/4 w-full"
          src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png"
          alt=""
        />
        <Link to="/explore" className="m-12 p-3">
          <span>Explore</span>
        </Link>
      </div>
      <div className="p-4 order-1 flex flex-col items-start space-y-11  border-solid border-2 border-secondary bg-background">
        <header>
          <h1 className="font-extrabold text-3xl  mb-8">what's happening</h1>
          <h2 className="font-bold text-2xl mb-4">Join Twitter today.</h2>
        </header>
        <Button
          className="bg-background border-2 border-secondary py-1"
          onClick={() => open(setSignUpModel)}
        >
          sign up
        </Button>
        <Model
          close={() => close(signInModel ? setSignInModel : setSignUpModel)}
          showDialog={showDialog}
          label={"quote"}
        >
          {signUpModel && <SignUp></SignUp>}
          {signInModel && <SignIn></SignIn>}
        </Model>
        <Button
          className="bg-background border-2 border-secondary py-1"
          onClick={() => open(setSignInModel)}
        >
          sign in
        </Button>
      </div>
    </div>
  );
}

export default Registration;
