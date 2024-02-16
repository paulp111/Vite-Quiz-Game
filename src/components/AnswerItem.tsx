import { IAnswer } from './types/types';

interface AnswerItemProps {
  answer: IAnswer;
  onAnswer: (isCorrect: boolean) => void;
}

const AnswerItem = ({ answer, onAnswer }: AnswerItemProps) => {
  return (
    <button onClick={() => onAnswer(answer.isCorrect)}>
      {answer.text}
    </button>
  );
};

export default AnswerItem;
