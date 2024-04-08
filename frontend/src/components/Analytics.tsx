import React, { useEffect, useState } from "react";
import { API_PATH } from "../api";
import humanizeDuration from "humanize-duration";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const StatsPage: React.FC = () => {
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_PATH}/stats?jwt=${localStorage.getItem("jwt")}`)
      .then((res) => res.json())
      .then((data) => {
        setStatsData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>VH Statistics</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Total VH</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsData.map((item: any) => (
            <TableRow key={item.username}>
              <TableCell>{item.username}</TableCell>
              <TableCell>
                {humanizeDuration(item.total_hours * 3.6e6, {
                  round: true,
                  units: ["h", "m", "s"],
                  largest: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsPage;
