import React, { useState } from "react";
import "./admin.css";
import StatsPage from "./components/StatsPage";
import ApprovalsPage from "./components/approvalspage";
import SettingsPage from "./components/settingspage";

const AdminPanel: React.FC = () => {
  const [selectedPill, setSelectedPill] = useState<string>("Approvals");
  const handlePillClick = (pillName: string) => {
    setSelectedPill(pillName);
  };

  const renderSelectedPage = () => {
    switch (selectedPill) {
      case "Stats":
        return <StatsPage />;
      case "Approvals":
        return <ApprovalsPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="p-5">
      <ul className="navsize sticky flex adminpanel">
        <li className="mr-3">
          <a
            className={`inline-block py-1 px-3 hover:text-green-800 ${selectedPill === "Approvals" ? "selected" : ""}`}
            href="#"
            onClick={() => handlePillClick("Approvals")}
          >
            Approvals
          </a>
        </li>
        <li className="mr-3">
          <a
            className={`inline-block py-1 px-3 hover:text-green-800 ${selectedPill === "Stats" ? "selected" : ""}`}
            href="#"
            onClick={() => handlePillClick("Stats")}
          >
            Statistics
          </a>
        </li>

        <li className="mr-3">
          <a
            className={`inline-block py-1 px-3 hover:text-green-800 ${selectedPill === "Settings" ? "selected" : ""}`}
            href="#"
            onClick={() => handlePillClick("Settings")}
          >
            Settings
          </a>
        </li>
      </ul>
      <br />
      {renderSelectedPage()}
    </div>
  );
};

export default AdminPanel;
