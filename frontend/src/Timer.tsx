import React, { useEffect, useState } from 'react';
import './Timer.css';

const Timer: React.FC = () => {
  
  const [timerHours, setTimerHours] = useState<number>(0);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerHours(0);
    setTimerMinutes(0);
    setTimerSeconds(0);
  };

useEffect(() => {
  const updateTime = () => {
    if (isRunning) {
      setTimerSeconds((prevSeconds) => (prevSeconds + 1) % 60);
      setTimerMinutes((prevMinutes) => Math.floor((prevMinutes + (timerSeconds + 1) / 60) % 60));
      setTimerHours((prevHours) => Math.floor(prevHours + (timerMinutes + 1) / 60));
    }
  };

  const intervalId = setInterval(updateTime, 1000);

  return () => clearInterval(intervalId);
}, [isRunning, timerSeconds, timerMinutes]);

  return (
    <div>
      <h2>Energy Club</h2> 
      <h1><strong>Volunteer Hour Counter</strong></h1>
      <div className="clock-container">
        <div className="clock-col">
          <p className="clock-hours clock-timer">{String(timerHours).padStart(2, '0')}</p>
          <p className="clock-label">Hours</p>
        </div>
        <div className="clock-col">
          <p className="clock-minutes clock-timer">{String(timerMinutes).padStart(2, '0')}</p>
          <p className="clock-label">Minutes</p>
        </div>
        <div className="clock-col">
          <p className="clock-seconds clock-timer">{String(timerSeconds).padStart(2, '0')}</p>
          <p className="clock-label">Seconds</p>
        </div>
      </div>
      <div className="button-container">
        {!isRunning ? (
            <button onClick={startTimer}>Start</button>
          ) : (
            <button onClick={pauseTimer}>Pause</button>
          )}
          <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;
