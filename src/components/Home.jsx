import React, { useState } from 'react';
import TimerForm from './TimerForm';
import TimerList from './TimerList';

function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const categories = ['Work', 'Exercise', 'Study', 'Break', 'Meditation','Other'];

  const handleSaveTimer = (timerData) => {
    const existingTimers = JSON.parse(localStorage.getItem('timers')) || [];
    existingTimers.push(timerData);
    localStorage.setItem('timers', JSON.stringify(existingTimers));
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <TimerForm onSave={handleSaveTimer} categories={categories} />
      <TimerList key={refreshKey} />
    </div>
  );
}

export default Home;
