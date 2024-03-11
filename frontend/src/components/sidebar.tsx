import "./sidebar.css";
import { SidebarData } from "./SidebarData";

function Bar() {
  return (
    <div className="sidebar basis-1/4 h-screen hidden md:block">
      <ul className="sidebarList">
        {SidebarData.map((val, key) => {
          return (
            <div>
              <li
                key={key}
                className={`row ${
                  window.location.pathname == val.link ? "active" : ""
                }`}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div className="icon">{val.icon}</div>
                <div className="title">{val.title}</div>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
export default Bar;
