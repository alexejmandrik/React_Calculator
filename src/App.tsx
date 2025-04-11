import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import ThemeToggle from './components/ThemeToggle';
import './Calculator.css'; // Импортируем стили

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Применяем класс к body
    const body = window.document.body;
    const currentTheme = isDarkMode ? 'dark' : 'light';
    body.classList.remove(isDarkMode ? 'light' : 'dark');
    body.classList.add(currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // Используем классы из Calculator.css
    <div className="app-container">
      <div className="calculator-wrapper">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Calculator />
      </div>
    </div>
  );
}

export default App;