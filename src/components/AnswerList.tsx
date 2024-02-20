import AnswerItem from './AnswerItem';
import { IAnswer } from './types/types';

interface AnswerListProps {
  answers: IAnswer[];
  onAnswer: (isCorrect: boolean) => void;
}

const AnswerList = ({ answers, onAnswer }: AnswerListProps) => {
  return (
    <div>
      {answers.map((answer, index) => (
        <AnswerItem key={index} answer={answer} onAnswer={onAnswer} />
      ))}
    </div>
  );
};

export default AnswerList;
