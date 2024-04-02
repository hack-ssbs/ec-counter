import React, { useEffect, useState } from "react";
import { API_PATH } from "../api";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Changed to Alpine Theme for a different look
import humanizeDuration from "humanize-duration";

const StatsPage: React.FC = () => {
  const [statsData, setStatsData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "username" },
    {
      field: "total_hours",
      headerName: "Total VH",
      valueGetter: (params: any) =>
        humanizeDuration(params.data.total_hours * 3.6e6, {
          round: true,
          units: ["h", "m", "s"],
          largest: 2,
        }),
    },
  ]);

  useEffect(() => {
    fetch(`${API_PATH}/stats?jwt=${localStorage.getItem("jwt")}`)
      .then((res) => res.json())
      .then((data) => {
        setStatsData(data);
      });
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <h2 className="text-2xl font-bold">User Stats</h2>
      <AgGridReact
        rowData={statsData}
        columnDefs={columnDefs as any}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default StatsPage;
