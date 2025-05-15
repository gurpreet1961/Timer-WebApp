import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function TimerList() {
  const [timers, setTimers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const savedTimers = JSON.parse(localStorage.getItem('timers')) || [];
    setTimers(savedTimers);
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const updateTimer = (updatedTimers) => {
    setTimers(updatedTimers);
    localStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const startTimer = (index) => {
    const updatedTimers = [...timers];
    updatedTimers[index].isRunning = true;
    updatedTimers[index].startTime = Date.now() - (updatedTimers[index].duration - updatedTimers[index].remaining) * 1000;
    updateTimer(updatedTimers);
  };

  const pauseTimer = (index) => {
    const updatedTimers = [...timers];
    updatedTimers[index].isRunning = false;
    updatedTimers[index].remaining = updatedTimers[index].duration - Math.floor((Date.now() - updatedTimers[index].startTime) / 1000);
    updateTimer(updatedTimers);
  };

  const resetTimer = (index) => {
    const updatedTimers = [...timers];
    updatedTimers[index].isRunning = false;
    updatedTimers[index].remaining = updatedTimers[index].duration;
    updateTimer(updatedTimers);
  };

  const startAll = () => {
    const updatedTimers = timers.map(timer => ({
      ...timer,
      isRunning: true,
      startTime: Date.now() - (timer.duration - timer.remaining) * 1000,
    }));
    updateTimer(updatedTimers);
  };

  const pauseAll = () => {
    const updatedTimers = timers.map(timer => ({
      ...timer,
      isRunning: false,
      remaining:  timer.duration - Math.floor((Date.now() - timer.startTime) / 1000) >=0 ?  timer.duration - Math.floor((Date.now() - timer.startTime) / 1000) : 0,
    }));
    
    updateTimer(updatedTimers);
  };

  const resetAll = () => {
    const updatedTimers = timers.map(timer => ({
      ...timer,
      isRunning: false,
      remaining: timer.duration,
    }));
    updateTimer(updatedTimers);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTimers = timers.map(timer => {
        if (timer.isRunning && timer.remaining > 0) {
          const remainingTime = timer.duration - Math.floor((Date.now() - timer.startTime) / 1000);
          if (remainingTime <= 0) {
            return { ...timer, remaining: 0, isRunning: false };
          }
          return { ...timer, remaining: remainingTime };
        }
        return timer;
      });

      updateTimer(updatedTimers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
  };

  const cardStyle = {
    backgroundColor: '#1e1e2f',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const responsiveGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '20px',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Saved Timers</h2>
      {timers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No timers found.</p>
      ) : (
        <>
          <div style={responsiveGrid}>
            {timers.map((timer, index) => {
              const percentage = (timer.remaining / timer.duration) * 100;

              return (
                <div key={index} style={cardStyle}>
                  <div
                    onClick={() => toggleExpand(index)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: '#00bfff',
                      marginBottom: '10px',
                    }}
                  >
                    {timer.name}
                  </div>
                  {expandedIndex === index && (
                    <>
                      <div style={{ width: 100, height: 100, margin: '0 auto' }}>
                        <CircularProgressbar
                          value={percentage}
                          text={timer.remaining === 0 ? 'Done' : formatTime(timer.remaining)}
                          styles={buildStyles({
                            textColor: '#fff',
                            pathColor: timer.remaining === 0 ? '#f44336' : '#00e676',
                            trailColor: '#444',
                          })}
                        />
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <p><strong>Duration:</strong> {timer.duration}s</p>
                        <p><strong>Category:</strong> {timer.category}</p>
                        <p><strong>Created At:</strong> {new Date(timer.createdAt).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                        {timer.isRunning && timer.remaining !== 0 ? (
                          <button style={buttonStyle} onClick={() => pauseTimer(index)} >Pause</button>
                        ) : (
                          <button style={buttonStyle} onClick={() => startTimer(index)} disabled={timer.remaining === 0}>Start</button>
                        )}
                        <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={() => resetTimer(index)}>Reset</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <button style={buttonStyle} onClick={startAll}>Start All</button>
            <button style={{ ...buttonStyle, backgroundColor: '#ffc107' }} onClick={pauseAll}>Pause All</button>
            <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={resetAll}>Reset All</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TimerList;
