// src/components/Quiz.jsx
import { useState, useMemo } from 'react';
import { questions, allNames } from '../data/questions';
import QuizQuestion from './QuizQuestion';
import Results from './Results';
import { submitScore } from '../utils/api';

export default function Quiz() {
  const [playerName, setPlayerName] = useState('');
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  // Shuffle questions once when quiz starts
  const shuffledQuestions = useMemo(() => 
    started ? [...questions].sort(() => Math.random() - 0.5) : questions,
  [started]);

  // Get names that have already been used (for elimination mode)
  const usedNames = useMemo(() => {
    return Object.values(answers);
  }, [answers]);

  // Get available names for current question (excluding used ones, but include current answer if exists)
  const getAvailableNames = (questionId) => {
    const currentAnswer = answers[questionId];
    return allNames.filter(name => 
      !usedNames.includes(name) || name === currentAnswer
    );
  };

  const calculateScore = () => {
    return shuffledQuestions.reduce((score, q) => {
      return score + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleAnswer = (questionId, answer) => {
    const currentAnswer = answers[questionId];
    
    // If clicking the same answer, deselect it
    if (currentAnswer === answer) {
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      return;
    }
    
    // Check if this question already had an answer (user is changing their answer)
    const hadPreviousAnswer = currentAnswer !== undefined;
    
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Only auto-advance if this is a NEW answer (not changing an existing one)
    // and not the last question
    if (!hadPreviousAnswer && currentIndex < shuffledQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    const finalScore = calculateScore();
    submitScore({
      playerName,
      score: finalScore,
      total: questions.length,
      percentage: Math.round((finalScore / questions.length) * 100),
      answers
    });
    setFinished(true);
  };

  const handleStart = () => {
    if (playerName.trim()) {
      setStarted(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  // Check if all questions have been answered
  const allAnswered = shuffledQuestions.every(q => answers[q.id]);
  const currentQuestion = shuffledQuestions[currentIndex];
  const isLastQuestion = currentIndex === shuffledQuestions.length - 1;

  if (!started) {
    return (
      <div className="start-screen">
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}ocula-logo.png`} alt="Ocula Technologies" className="company-logo" />
        </div>
        
        <div className="start-card">
          <h1 className="quiz-title">Guess the Tree! 🎄</h1>
          <p className="quiz-subtitle">Can you match the tree to the teammate?</p>
          
          <div className="stats-preview">
            <div className="stat">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat">
              <span className="stat-number">{allNames.length}</span>
              <span className="stat-label">Trees</span>
            </div>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="name-input"
              autoFocus
            />
            <button 
              onClick={handleStart}
              disabled={!playerName.trim()}
              className="start-button"
            >
              Start Quiz
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        
        <a href="#/admin" className="admin-link">Admin</a>
      </div>
    );
  }

  if (finished) {
    return (
      <Results 
        score={calculateScore()} 
        total={questions.length}
        playerName={playerName}
        questions={shuffledQuestions}
        answers={answers}
      />
    );
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <img src={`${import.meta.env.BASE_URL}ocula-logo.png`} alt="Ocula" className="quiz-logo" />
      </div>
      <QuizQuestion
        question={currentQuestion}
        options={getAvailableNames(currentQuestion.id)}
        selectedAnswer={answers[currentQuestion.id]}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={shuffledQuestions.length}
      />
      
      <div className="navigation-buttons">
        <button 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="nav-button prev-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Previous
        </button>
        
        {isLastQuestion && (
          <button 
            onClick={handleFinish}
            disabled={!allAnswered}
            className="nav-button finish-button"
          >
            Finish Quiz
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
