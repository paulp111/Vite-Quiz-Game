interface ResultProps {
  score: number;
  totalQuestions: number;
}

const Result = ({ score, totalQuestions }: ResultProps) => {
  return (
    <div>
      <h1>Ergebnis</h1>
      <p>Deine Punktzahl ist {score} von {totalQuestions}.</p>
    </div>
  );
};

export default Result;
