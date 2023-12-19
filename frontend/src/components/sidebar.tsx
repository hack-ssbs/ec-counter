import React from "react";
import "./sidebar.css";
import { SidebarData } from "./SidebarData";

function Bar() {
  return (
    <div className="sidebar">
      <ul className = "sidebarList">
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              id = {window.location.pathname == val.link ? "active": ""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div className="icon">{val.icon}</div>
              <div className = 'title'>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Bar;
