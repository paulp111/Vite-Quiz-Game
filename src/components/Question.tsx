import AnswerList from './AnswerList';
import { IQuestion } from './types/types';

interface QuestionProps {
  question: IQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

const Question = ({ question, onAnswer }: QuestionProps) => {
  return (
    <div>
      <h2>{question.questionText}</h2>
      <AnswerList answers={question.answers} onAnswer={onAnswer} />
    </div>
  );
};

export default Question;
