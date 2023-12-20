// RouterComponent.tsx
import React from "react";
import LoginForm from "./login";
import Timer from "./Timer";
import Bar from "./components/sidebar.tsx";

import "./App.css";

function App() {
  return (
    <div className="flex flex-row w-screen pr-10">
      <Bar />
      <div className="flex-1 ml-5">
        {(window.location.href.endsWith("/timer") ||
          window.location.href.endsWith("/")) && <Timer />}
        {window.location.href.endsWith("/account") && <LoginForm />}
      </div>
    </div>
  );
}

export default App;
