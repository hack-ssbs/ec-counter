import "./sidebar.css";
import { SidebarData } from "./SidebarData";
import { Link } from "@tanstack/react-router";
import {useState} from "react";

function Bar() {
    const [opened, setOpen] = useState(false)
  return (
          <div className="flex h-screen">
              <div className={`sidebar basis-1/4 sidebarList ${opened?'block':'hidden'} md:block`}>
                  {SidebarData.map((val, key) => {
                      return (
                          <Link key={key} className="row [&.active]:active" to={val.link}>
                              <div className="icon">{val.icon}</div>
                              <div className="title">{val.title}</div>
                          </Link>
                      );
                  })}
              </div>
          <button
              onClick={() => setOpen(!opened)}
              type="button"
              className="rounded-md mt-0 h-24 w-24 relative top-0 inline-block px-3 hover:text-token-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:opacity-50 md:hidden">
              <span className="sr-only">Open sidebar</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
                        fill="currentColor"></path>
              </svg>
          </button>
      </div>
  );
}
export default Bar;
