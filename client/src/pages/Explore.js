import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import NavLink from "../components/navLink";
import Suggest from "../components/suggest";
import Trends from "../components/Trends";

export default function Explore() {
  return (
    <div>
      <Header goBack={true} title="explore"></Header>

      <ul className="flex space-x-2 p-2">
        <ListItem>
          <NavLink end to="">
            Trends
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to={`people`} partial>
            People{" "}
          </NavLink>
        </ListItem>
      </ul>
      <div className=" w-1/2 p-4 ">
        <Routes>
          <Route path="/people" element={<Suggest />}></Route>

          <Route index element={<Trends />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export function ListItem({ children }) {
  return (
    <li className="p-2 text-neutral transition-all ease-in">{children}</li>
  );
}
