export interface QuizQuestion {
  question: string;
  topic?: string;
  options: string[];
  correct_answer: number | string;
  explanation?: string;
}

export interface QuizGradingResult {
  score: number;
  totalQuestions: number;
  strengths: string[];
  weaknesses: string[];
  inconsistencies: { questionIndex: number; reason: string }[];
}

export function gradeQuiz(quizData: QuizQuestion[], userAnswers: Record<number, number | string>): QuizGradingResult {
  let validScore = 0;
  let totalValidQuestions = 0;
  const inconsistencies: { questionIndex: number; reason: string }[] = [];
  const topicStats: Record<string, { total: number; correct: number }> = {};

  quizData.forEach((q, i) => {
    // 1. Check if question has a correct answer defined
    if (q.correct_answer === undefined || q.correct_answer === null) {
      inconsistencies.push({ questionIndex: i, reason: "Missing correct_answer" });
      return; // Skip this question
    }

    let normalizedCorrectAnswer: number | string = q.correct_answer;

    // Normalize correct_answer
    if (typeof normalizedCorrectAnswer === 'string') {
      normalizedCorrectAnswer = normalizedCorrectAnswer.trim();
      
      // Is it a number string? (e.g. "2")
      if (/^\d+$/.test(normalizedCorrectAnswer)) {
        normalizedCorrectAnswer = parseInt(normalizedCorrectAnswer, 10);
      } 
      // Is it a letter choice? (e.g. "C", "b")
      else if (/^[A-D]$/i.test(normalizedCorrectAnswer)) {
        normalizedCorrectAnswer = normalizedCorrectAnswer.toUpperCase().charCodeAt(0) - 65;
      } 
      // It might be the text of the option itself. Check case-insensitive match
      else {
        const matchedIndex = q.options.findIndex(opt => 
          opt.trim().toLowerCase() === String(normalizedCorrectAnswer).toLowerCase()
        );
        if (matchedIndex !== -1) {
          normalizedCorrectAnswer = matchedIndex;
        } else {
          inconsistencies.push({ questionIndex: i, reason: "correct_answer string does not match any option" });
          return; // Skip this question as it's invalid
        }
      }
    }

    // Ensure it's a valid index
    if (typeof normalizedCorrectAnswer !== 'number' || normalizedCorrectAnswer < 0 || normalizedCorrectAnswer >= q.options.length) {
      inconsistencies.push({ questionIndex: i, reason: "correct_answer index out of bounds" });
      return;
    }

    totalValidQuestions++;
    const topic = q.topic || 'General';
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0 };
    }
    topicStats[topic].total += 1;

    const userAnswer = userAnswers[i];
    // We assume userAnswers are always indices since the UI passes the index
    if (userAnswer === normalizedCorrectAnswer) {
      validScore++;
      topicStats[topic].correct += 1;
    }
  });

  if (inconsistencies.length > 0) {
    console.warn("Quiz Grading Inconsistencies detected. Some questions were excluded from grading:", inconsistencies);
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  Object.entries(topicStats).forEach(([topic, stats]) => {
    if (stats.correct / stats.total >= 0.7) {
      strengths.push(topic);
    } else {
      weaknesses.push(topic);
    }
  });

  return {
    score: validScore,
    totalQuestions: totalValidQuestions,
    strengths,
    weaknesses,
    inconsistencies,
  };
}
