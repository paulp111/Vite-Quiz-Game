import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  Fab,
  styled
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import "./components/css/App.css";


function background(backgroundData: { background: string }) {
  const baseUrl = import.meta.env.BASE_URL;
  const backgroundImgUrl = `${baseUrl}/${backgroundData.background}`;
  const backgroundImg = {
    backgroundImage: `url(${backgroundImgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

const StyledTitleTypography = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontSize: '5rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #FF8E53, #FE6B8B, #FF8E53)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
});

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: string;
  questionText: string;
  answers: Answer[];
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswers, setNewAnswers] = useState<Answer[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const [quizFinished, setQuizFinished] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3001/questions");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Could not fetch questions: ", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleToggleForm = () => setShowForm(!showForm);

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewQuestionText(event.target.value);
  };

  const handleAnswerChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedAnswers = newAnswers.map((answer, idx) =>
      idx === index ? { ...answer, text: event.target.value } : answer
    );
    setNewAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index: number) => {
    const updatedAnswers = newAnswers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === index,
    }));
    setNewAnswers(updatedAnswers);
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestionText.trim() ||
      newAnswers.some((answer) => !answer.text.trim())
    ) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    try {
      await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: newQuestionText,
          answers: newAnswers,
        }),
      });

      setNewQuestionText("");
      setNewAnswers([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      fetchQuestions();
    } catch (error) {
      console.error("Could not add the new question: ", error);
    }
  };

  const handleResetQuestions = async () => {
    const nonDefaultQuestions = questions.slice(3);
    for (const question of nonDefaultQuestions) {
      await fetch(`http://localhost:3001/questions/${question.id}`, {
        method: "DELETE",
      });
    }
    fetchQuestions();
    setQuizFinished(false);
  };

  const handleRestartQuiz = () => {
    setQuizFinished(false);
    setQuestions([]);
  };
  
  return (
    <Box className="App">
      <Container maxWidth="sm">
        <StyledTitleTypography
          gutterBottom
        >
          Quiz
        </StyledTitleTypography>
        <Box position="fixed" bottom={16} right={16}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleToggleForm}
            sx={{ mr: 2 }}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="reset"
            onClick={handleResetQuestions}
          >
            <RefreshIcon />
          </Fab>
        </Box>
        {showForm && (
          <Box
            component="form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleAddQuestion();
            }}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              label="Neue Frage"
              variant="outlined"
              fullWidth
              value={newQuestionText}
              onChange={handleQuestionChange}
              margin="normal"
            />
            {newAnswers.map((answer, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <TextField
                  label={`Antwort ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={answer.text}
                  onChange={(e) =>
                    handleAnswerChange(
                      index,
                      e as React.ChangeEvent<HTMLInputElement>
                    )
                  }
                  margin="normal"
                />
                <Button
                  onClick={() => handleCorrectAnswerChange(index)}
                  variant="contained"
                  sx={{ ml: 2 }}
                  color={answer.isCorrect ? "success" : undefined}
                >
                  Als richtig markieren
                </Button>
              </Box>
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Frage hinzufügen
            </Button>
          </Box>
        )}
        {!showForm && questions.length > 0 ? (
          <Quiz questions={questions} setQuizFinished={setQuizFinished} />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {quizFinished && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRestartQuiz}
            >
              Quiz neu starten
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
