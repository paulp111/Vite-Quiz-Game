import { useState, useEffect } from 'react';
import Question from './Question';
import Result from './Result';
import { IQuestion } from './types/types';

interface QuizProps {
  questions: IQuestion[];
  setQuizFinished: (finished: boolean) => void;
}

const Quiz = ({ questions, setQuizFinished }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinishedLocal] = useState(false);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinishedLocal(false);
  }, [questions]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinishedLocal(true);
      setQuizFinished(true);
    }
  };

  return (
    <div>
      {!quizFinished ? (
        <Question
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <Result score={score} totalQuestions={questions.length} />
      )}
    </div>
  );
};

export default Quiz;
