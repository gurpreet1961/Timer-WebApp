import React, { useState } from 'react';
import './TimerForm.css'; // Create this CSS file

function TimerForm({ onSave, categories }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === '' || category === '') return;

    const newTimer = {
      name,
      duration,
      category,
      createdAt: new Date().toISOString(),
      remaining: duration,
      isRunning: false,
    };

    onSave(newTimer);

    setName('');
    setDuration(60);
    setCategory('');
  };

  return (
    <form className="timer-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create a New Timer</h2>

      <input
        className="form-input"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Timer Name"
      />

      <input
        className="form-input"
        type="number"
        required
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duration (seconds)"
        min="1"
      />

      <select
        className="form-input"
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>Select Category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit" className="form-button">Save Timer</button>
    </form>
  );
}

export default TimerForm;
