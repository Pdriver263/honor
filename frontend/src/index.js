import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App কম্পোনেন্ট ইমপোর্ট করা হচ্ছে
import './index.css'; // যদি CSS ফাইল থাকে তবে এটি ইমপোর্ট করুন

// রুট এলিমেন্ট খুঁজে বের করে অ্যাপটি রেন্ডার করা হচ্ছে
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);