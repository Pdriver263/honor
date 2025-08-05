import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setResult(eval(input).toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '←') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', '←'
  ];

  return (
    <div className="dashboard-container">
      <h2>ক্যালকুলেটর</h2>
      <div className="calculator">
        <div className="display">
          <div className="input">{input}</div>
          <div className="result">{result}</div>
        </div>
        <div className="buttons">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`btn ${btn === '=' ? 'equals' : ''} ${btn === 'C' || btn === '←' ? 'clear' : ''}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;