import React, { useContext, useEffect } from "react";
import "./App.css";
import "@reach/listbox/styles.css";
import AuthApp from "./authApp";
import UnAuthApp from "./unAuthApp";
import { useAuth } from "./useAuth";
function App() {
  if (process.env.NODE_ENV === "development") {
    console.log = () => {};
    console.error = () => {};
    console.assert = () => {};
    console.warn = () => {};
  }

  const user = useAuth();
  // useEffect(() => {zz
  //   window.scrollTo(0, 0);
  // }, []);

  if (user) return <AuthApp />;
  return <UnAuthApp />;
}

export default App;
