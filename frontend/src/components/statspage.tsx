import React, { useEffect, useState } from "react";
import { API_PATH } from "../api";

const StatsPage: React.FC = () => {
  const [statsData, setStatsData] = useState([]);
  useEffect(() => {
    fetch(`${API_PATH}/stats?jwt=${localStorage.getItem("jwt")}`)
      .then((res) => res.json())
      .then((data) => {
        setStatsData(data);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <div>
        <h2>User Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {statsData.map((user, index) => (
              <tr key={index}>
                <td>{user["username"]}</td>
                <td>{(user["total_hours"] as number).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsPage;
