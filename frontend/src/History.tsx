import { useState, useEffect } from "react";
import { API_PATH } from "./api";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";

type TimeLog = {
  description: string;
  start: Date;
  end: Date;
};

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
  round: true,
  spacer: "",
});

export const History: React.FC = () => {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    let jwt = localStorage.getItem("jwt");
    if (!jwt) {
      window.location.href = "/account";
      return;
    }
    try {
      const response = await fetch(`${API_PATH}/mylogs?jwt=${jwt}`);
      if (!response.ok) {
        toast.error("Failed to fetch data");
        return;
      }
      const data = await response.json();
      setLogs(
        data
          .map((log: any) => ({
            description: log.description,
            start: new Date(log.start),
            end: new Date(log.end),
          }))
          .reverse()
      );
    } catch (error) {
      toast.error("An error occurred while fetching the data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatInterval = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return (
      <span className="text-neutral-950">
        {start.toLocaleDateString(undefined, options)}
        <span className="text-neutral-600"> to </span>
        {end.toLocaleDateString(undefined, options)}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <span className="text-2xl font-semibold mb-4">
        Your Volunteer Hour Log
      </span>
      <p className="mx-3 block">
        Total VH:{" "}
        <span className="font-semibold">
          {shortEnglishHumanizer(
            logs.reduce(
              (acc, log) => acc + (log.end.getTime() - log.start.getTime()),
              0
            )
          )}
        </span>
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2 ml-2">
          {logs.map((log, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              Description:{" "}
              <span className="font-semibold">{log.description}</span>
              <p>
                Duration:{" "}
                <span className="font-semibold">
                  {shortEnglishHumanizer(
                    log.end.getTime() - log.start.getTime()
                  )}
                </span>
              </p>
              <p>{formatInterval(log.start, log.end)}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchData}
        disabled={loading}
        className="mt-4 bg-green-800 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
      >
        Refresh
      </button>
    </div>
  );
};
