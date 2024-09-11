import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(1 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const [workTime, setWorkTime] = useState(1); // Work time in minutes (default 1 minute)
  const [shortBreakTime, setShortBreakTime] = useState(1); // Short break in minutes (default 1 minute)
  const [longBreakTime, setLongBreakTime] = useState(15); // Long break in minutes (default 15 minutes)

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0) {
      console.log(isBreak);
      const buzzSound = new Audio("../../assets/buzz.mp3");
      if (isBreak && sessionCount < 4) {
        setIsBreak(false);
        setTime(Number(workTime) * 60); // Work session time
      } else {
        setIsBreak(true);
        setSessionCount(sessionCount + 1);
        buzzSound.play();
        if (sessionCount < 3) {
          setTime(Number(shortBreakTime) * 60); // Short break
        } else {
          setTime(Number(longBreakTime) * 60); // Long break
          setSessionCount(0);
        }
      }
      console.log(sessionCount);
      setIsActive(true);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    time,
    isBreak,
    sessionCount,
    workTime,
    shortBreakTime,
    longBreakTime,
  ]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  const resetTimer = () => {
    setIsActive(false);
    setTime(workTime * 60);
    setIsBreak(false);
    setSessionCount(0);
  };

  const handleWorkTimeChange = (e) => {
    const newWorkTime = Number(e.target.value);
    setWorkTime(newWorkTime);
    if (!isActive && !isBreak) {
      setTime(newWorkTime * 60); // Update timer immediately if not active and not on break
    }
  };

  return (
    <div
      className="container my-2 card shadow-lg p-3 mb-5 bg-body"
      style={{ width: "18rem", height: "28rem", paddingTop: "2rem" }}
    >
      <div className="row justify-content-md-center card-title">
        <h2 className="text-center">
          {isBreak ? (3 <= sessionCount ? "Break" : "Break") : "Work Session"}
        </h2>
      </div>

      <div className="row justify-content-md-center mt-3">
        <div className="col-md-auto">
          <span class="h1 ">
            {" "}
            {`${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${
              time % 60
            }`}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleTimer}
          class="col-md-auto btn btn-outline-primary"
          style={{ width: "8rem", height: "3rem" }}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <div onClick={resetTimer} className="col-md-auto pt-2">
          <i class="bi bi-arrow-clockwise align-middle"></i>
        </div>
      </div>

      <div
        className="row justify-content-md-center mt-3"
        style={{ width: "17rem", height: "28rem", paddingTop: "1rem" }}
      >
        <div className="col-md-auto">
          <label className="mb-1">Work Time (minutes):</label>
          <input
            type="number"
            value={workTime}
            onChange={handleWorkTimeChange}
            className="form-control"
            disabled={isActive} // Disable input if timer is active
          />
        </div>
        <div className="col-md-auto">
          <label className="mb-1">Short Break (minutes):</label>
          <input
            type="number"
            value={shortBreakTime}
            onChange={(e) => setShortBreakTime(e.target.value)}
            className="form-control"
            disabled={isActive}
          />
        </div>
        <div className="col-md-auto">
          <label className="mb-1">Long Break (minutes):</label>
          <input
            type="number"
            value={longBreakTime}
            onChange={(e) => setLongBreakTime(e.target.value)}
            className="form-control"
            disabled={isActive}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
