export interface IAnswer {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id?: string;
  questionText: string;
  answers: IAnswer[];
}
