export type AnswerValue = 0 | 1 | 2 | 3 | 4;

export interface Option {
  label: string;
  value: AnswerValue;
}

export interface Question {
  id: number;
  text: string;
}

export type Step = 'start' | 'quiz' | 'review' | 'result';

export interface EvaluationResult {
  scoreRange: [number, number];
  title: string;
  description: string;
  colorClass: string;
}
