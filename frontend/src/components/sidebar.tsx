import "./sidebar.css";
import { SidebarData } from "./SidebarData";
import { Link } from "@tanstack/react-router";

function Bar() {
  return (
    <div className="sidebar basis-1/4 h-screen hidden md:block">
      <div className="sidebarList">
        {SidebarData.map((val, key) => {
          return (
            <Link key={key} className="row [&.active]:active" to={val.link}>
              <div className="icon">{val.icon}</div>
              <div className="title">{val.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default Bar;
