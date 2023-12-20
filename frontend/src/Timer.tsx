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
      <h2 className='text-2xl text-black'>Energy Club</h2> 
      <h1 className='text-3xl text-black'>Volunteer Hour Counter</h1>
      <div className="clock-container flex">
        <div className="clock-col flex-1">
          <p className="clock-hours clock-timer">{String(timerHours).padStart(2, '0')}</p>
          <p className="clock-label">Hours</p>
        </div>
        <div className="clock-col flex-1">
          <p className="clock-minutes clock-timer">{String(timerMinutes).padStart(2, '0')}</p>
          <p className="clock-label">Minutes</p>
        </div>
        <div className="clock-col flex-1">
          <p className="clock-seconds clock-timer">{String(timerSeconds).padStart(2, '0')}</p>
          <p className="clock-label">Seconds</p>
        </div>
      </div>
      <div className="button-container">
        {!isRunning ? (
            <button className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outlin" onClick={startTimer}>
              Start
              </button>
          ) : (
            <button className='bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outline' onClick={pauseTimer}>
              Pause
            </button>
          )}
          <button className='bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded transform transition duration-150 ease-in-out hover:scale-105 focus:outline-none focus:shadow-outline' onClick={resetTimer}>
            Reset
          </button>
      </div>
    </div>
  );
};

export default Timer;
