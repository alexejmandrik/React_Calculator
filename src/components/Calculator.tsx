import React, { useState, useEffect, useCallback } from 'react';
import Display from './Display'; 
import Button from './Button';   
import History from './History'; 
import { Operator, HistoryEntry } from '../types';

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operand1, setOperand1] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand2, setWaitingForOperand2] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearAll = useCallback(() => {
    setDisplayValue('0');
    setOperand1(null);
    setOperator(null);
    setWaitingForOperand2(false);
    setError(null); 
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const calculate = (op1: number, op2: number, op: Operator): number | string => {
    switch (op) {
      case '+':
        return op1 + op2;
      case '-':
        return op1 - op2;
      case '*':
        return op1 * op2;
      case '/':
        if (op2 === 0) {
          return "Деление на ноль!";
        }
        const result = op1 / op2;
        return Math.round(result * 1e12) / 1e12; 
      default:
        console.error("Неизвестная операция:", op);
        return "Ошибка: Неизвестная операция";
    }
  };

  const handleNumberInput = useCallback((digit: string) => {
    if (error) {
        clearAll();
        setDisplayValue(digit === '.' ? '0.' : digit);
        return;
    }

    if (waitingForOperand2) {
      setDisplayValue(digit === '.' ? '0.' : digit);
      setWaitingForOperand2(false);
    } else {
      if (displayValue === '0' && digit === '0') return;
      if (digit === '.' && displayValue.includes('.')) return;
      if (displayValue === '0' && digit !== '.') {
          setDisplayValue(digit);
      } else {
         if (displayValue.length >= 16) return;
         setDisplayValue(prevDisplayValue => prevDisplayValue + digit);
      }
    }
  }, [displayValue, waitingForOperand2, error, clearAll]);

  const handleOperatorInput = useCallback((selectedOperator: Operator) => {
    if (error) return;

    const currentValue = parseFloat(displayValue);

    if (isNaN(currentValue)) {
        setError("Некорректный ввод");
        setDisplayValue("Ошибка");
        return;
    }

    if (operand1 !== null && operator !== null && !waitingForOperand2) {
      const result = calculate(operand1, currentValue, operator);

      if (typeof result === 'string') {
        setError(result);
        setDisplayValue("Ошибка");
        setOperand1(null); 
        setOperator(null); 
        setWaitingForOperand2(false);
      } else {
        const expression = `${operand1} ${operator} ${currentValue}`;
        const resultStr = String(result);
        setHistory(prev => [...prev, { id: Date.now(), expression, result: resultStr }]);
        setDisplayValue(resultStr);
        setOperand1(result);
        setOperator(selectedOperator); 
        setWaitingForOperand2(true);
      }
    } else {
      setOperand1(currentValue);
      setOperator(selectedOperator);
      setWaitingForOperand2(true); 
    }

  }, [displayValue, operand1, operator, waitingForOperand2, error, calculate]);

  const handleEquals = useCallback(() => {
    if (error || operand1 === null || operator === null || waitingForOperand2) {
      return;
    }

    const operand2 = parseFloat(displayValue);

     if (isNaN(operand2)) {
        setError("Некорректный второй операнд");
        setDisplayValue("Ошибка");
        setOperand1(null);
        setOperator(null);
        setWaitingForOperand2(false);
        return;
     }

    const result = calculate(operand1, operand2, operator);

    if (typeof result === 'string') {
      setError(result);
      setDisplayValue("Ошибка");
    } else {
      const expression = `${operand1} ${operator} ${operand2}`;
      const resultStr = String(result);
      setHistory(prev => [...prev, { id: Date.now(), expression, result: resultStr }]);
      setDisplayValue(resultStr);
      setError(null); 
    }

    // Сбрасываем состояние для возможности нового вычисления
    // Можно оставить результат на дисплее для начала новой операции с ним
    // Но сбросим операнд/оператор/флаг, чтобы '=' не срабатывал повторно
    setOperand1(null); 
    setOperator(null);
    setWaitingForOperand2(true);

  }, [displayValue, operand1, operator, waitingForOperand2, error, calculate]);

  const handleBackspace = useCallback(() => {
    if (error) {
        clearAll();
        return;
    }
    if (waitingForOperand2) return;

    setDisplayValue(prev => {
      if (prev === '0' || prev.length === 1 || (prev.startsWith('-') && prev.length === 2) ) {
        return '0'; 
      }
      return prev.slice(0, -1); 
    });
  }, [waitingForOperand2, error, clearAll]);

  const handleButtonClick = useCallback((label: string) => {
    if (/\d/.test(label) || label === '.') {
      handleNumberInput(label);
    } else if (['+', '-', '*', '/'].includes(label)) {
      handleOperatorInput(label as Operator);
    } else if (label === '=') {
      handleEquals();
    } else if (label === 'C') {
      clearAll();
    } else if (label === '⌫') {
      handleBackspace();
    }
  }, [handleNumberInput, handleOperatorInput, handleEquals, clearAll, handleBackspace]); 
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (/\d/.test(key) || key === '.') {
        handleButtonClick(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleButtonClick(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        handleButtonClick('⌫');
      } else if (key === 'Escape') { 
        handleButtonClick('C');
      } else if (key.toLowerCase() === 'c') {
         handleButtonClick('C');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleButtonClick]); 
  const buttons = [
    'C', '⌫', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  return (
    <div className="calculator">
      {/* Отображение ошибки */}
      <div className="error-message">{error ? error : ''}</div>
      {/* Дисплей */}
      <Display value={displayValue} />
      {/* Сетка кнопок */}
      <div className="button-grid">
        {buttons.map((label) => {
          const spanClass = (label === '0' || label === '=') ? 'button-span-2' : '';
          return (
            <Button
              key={label}
              label={label}
              onClick={handleButtonClick}
              additionalClassName={spanClass}
            />
          );
        })}
      </div>
      {/* История */}
      <History entries={history} onClearHistory={clearHistory} />
    </div>
  );
};

export default Calculator;