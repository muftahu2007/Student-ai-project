import { describe, it, expect } from 'vitest';
import { gradeQuiz, QuizQuestion } from './quizValidation';

describe('gradeQuiz', () => {
  it('handles exact integer matches', () => {
    const quizData: QuizQuestion[] = [
      { question: '1+1', options: ['1', '2', '3', '4'], correct_answer: 1 },
    ];
    const userAnswers = { 0: 1 }; // user picked index 1
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(1);
    expect(result.inconsistencies).toHaveLength(0);
  });

  it('handles correct_answer as numeric string', () => {
    const quizData: QuizQuestion[] = [
      { question: '1+1', options: ['1', '2', '3', '4'], correct_answer: "1" },
    ];
    const userAnswers = { 0: 1 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(1);
  });

  it('handles correct_answer as a letter', () => {
    const quizData: QuizQuestion[] = [
      { question: '1+1', options: ['1', '2', '3', '4'], correct_answer: "B" },
      { question: '2+2', options: ['2', '4', '6', '8'], correct_answer: "b" },
    ];
    const userAnswers = { 0: 1, 1: 1 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(2);
    expect(result.totalQuestions).toBe(2);
  });

  it('handles correct_answer as text exactly matching the option', () => {
    const quizData: QuizQuestion[] = [
      { question: 'Capital of France', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct_answer: "Paris" },
    ];
    const userAnswers = { 0: 1 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(1);
  });

  it('handles correct_answer as text with case and space differences', () => {
    const quizData: QuizQuestion[] = [
      { question: 'Capital of France', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct_answer: " pARis " },
    ];
    const userAnswers = { 0: 1 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(1);
  });

  it('detects missing correct_answer and excludes it', () => {
    const quizData = [
      { question: 'Q1', options: ['A', 'B'], correct_answer: 0 },
      { question: 'Q2', options: ['A', 'B'] } as any,
    ];
    const userAnswers = { 0: 0, 1: 1 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(1);
    expect(result.inconsistencies).toHaveLength(1);
    expect(result.inconsistencies[0].reason).toContain('Missing correct_answer');
  });

  it('detects unmappable correct_answer string and excludes it', () => {
    const quizData: QuizQuestion[] = [
      { question: 'Q1', options: ['Apple', 'Banana', 'Cherry', 'Date'], correct_answer: "Grape" },
    ];
    const userAnswers = { 0: 0 };
    const result = gradeQuiz(quizData, userAnswers);
    expect(result.score).toBe(0);
    expect(result.totalQuestions).toBe(0);
    expect(result.inconsistencies).toHaveLength(1);
    expect(result.inconsistencies[0].reason).toContain('does not match any option');
  });
});
