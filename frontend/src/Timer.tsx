import React, { useEffect, useState } from "react";
import "./Timer.css";
import { API_PATH } from "./api";
import { toast } from "react-toastify";

const Timer: React.FC = () => {
  const [startTime, setStartTime] = useState<number | null>(
    localStorage.getItem("startTime")
      ? Number(localStorage.getItem("startTime"))
      : null
  );
  const [endTime, setEndTime] = useState<number | null>(
    localStorage.getItem("endTime")
      ? Number(localStorage.getItem("endTime"))
      : null
  );
  const [isRunning, setIsRunning] = useState<boolean>(
    localStorage.getItem("startTime") !== null &&
      localStorage.getItem("endTime") === null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Added state for submitting

  const startTimer = () => {
    const now = Date.now();
    localStorage.setItem("startTime", now.toString());
    setStartTime(now);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    const now = Date.now();
    localStorage.setItem("endTime", now.toString());
    setEndTime(now);
    setIsRunning(false);
  };

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const resetTimer = () => {
    setIsRunning(false);
    localStorage.removeItem("startTime");
    localStorage.removeItem("endTime");
    setStartTime(null);
    setEndTime(null);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const calculateTime = () => {
    if (!startTime) return { hours: 0, minutes: 0, seconds: 0 };
    const end = endTime ? endTime : Date.now();
    const elapsed = end - startTime;
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => {
        setStartTime(Number(localStorage.getItem("startTime")));
        const { hours, minutes, seconds } = calculateTime();
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, endTime]);

  if (localStorage.getItem("jwt") === null) {
    window.location.href = "/account";
  }

  const handleSubmit = async () => {
    // Changed to async function
    if (startTime === null || endTime === null) {
      toast.error("Please start and end the timer first");
      return;
    }
    setIsSubmitting(true); // Set submitting state to true
    let start_iso = new Date(startTime).toISOString();
    let end_iso = new Date(endTime).toISOString();
    let jwt = localStorage.getItem("jwt");
    if (jwt === null) {
      toast.error("Please login first");
      setIsSubmitting(false); // Reset submitting state
      return;
    }
    let description = prompt("Please enter a description of your work");
    try {
      const response = await fetch(
        `${API_PATH}/addlog?jwt=${jwt}&start=${start_iso}&end=${end_iso}&description=${description}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        toast.error("API response was not ok");
        throw new Error("API response was not ok");
      }
      await response.json();
      toast.success("Hours logged successfully");
      resetTimer();
    } catch (error) {
      console.error("Failed to submit hours", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="justify-center">
      <h2 className="text-2xl text-black pt-10 pb-5 font-semibold">Energy Club</h2>
      <h1 className="text-3xl text-black font-normal">Volunteer Hour Counter</h1>
      <div className="clock-container flex">
        <div className="clock-col flex-1">
          <p className="clock-hours clock-timer">
            {String(hours).padStart(2, "0")}
          </p>
          <p className="clock-label">Hours</p>
        </div>
        <div className="clock-col flex-1">
          <p className="clock-minutes clock-timer">
            {String(minutes).padStart(2, "0")}
          </p>
          <p className="clock-label">Minutes</p>
        </div>
        <div className="clock-col flex-1">
          <p className="clock-seconds clock-timer">
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="clock-label">Seconds</p>
        </div>
      </div>
      <div className="button-container">
        {!isRunning ? (
          startTime == null && (
            <button
              className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outlin"
              onClick={startTimer}
            >
              Start
            </button>
          )
        ) : (
          <button
            className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outline"
            onClick={pauseTimer}
          >
            End
          </button>
        )}
        <button
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outline"
          onClick={resetTimer}
        >
          Reset
        </button>
        {!isRunning && startTime ? (
          <button
            className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`} // Added conditional styling for submitting state
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Timer;
