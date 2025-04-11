export type Operator = '+' | '-' | '*' | '/';

export interface HistoryEntry {
  id: number; // Для уникального ключа в React
  expression: string;
  result: string;
}