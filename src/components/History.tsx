import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryProps {
  entries: HistoryEntry[];
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ entries, onClearHistory }) => {
  return (
    <div className="history">
      <div className="history-header">
        <h3 className="history-title">История</h3>
        {entries.length > 0 && (
          <button
            onClick={onClearHistory}
            className="history-clear-button"
          >
            Очистить
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="history-empty">История вычислений пуста.</p>
      ) : (
        <ul className="history-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.expression} = {entry.result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;