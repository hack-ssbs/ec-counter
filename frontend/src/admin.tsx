import React, { useState } from "react";
import "./admin.css";

interface VHStatistic {
  userId: string;
  activityId: string;
  VHLength: number;
}

interface VHSubmission {
  userId: string;
  submissionMethod: string; // e.g., "计时提交" or "手动输入提交"
  approved: boolean;
}

const StatsPage: React.FC = () => {
  return <div>Stats Page Content</div>;
};

const ApprovalsPage: React.FC = () => {
  return <div>Approvals Page Content</div>;
};

const SettingsPage: React.FC = () => {
  return <div>Settings Page Content</div>;
};

const AdminPanel: React.FC = () => {
  const [selectedPill, setSelectedPill] = useState<string>("Stats");
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
