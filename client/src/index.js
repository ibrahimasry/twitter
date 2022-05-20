import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "@reach/menu-button/styles.css";
import socket from "./socket";
import AppProvider from "./AppProvider";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<AppProvider />);
