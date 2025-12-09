// src/components/QuizQuestion.jsx
import { useMemo } from 'react';

export default function QuizQuestion({ 
  question, 
  options, 
  selectedAnswer,
  onAnswer, 
  questionNumber, 
  totalQuestions 
}) {
  // Shuffle options for each question (but keep stable for same question)
  const shuffledOptions = useMemo(() => 
    [...options].sort(() => Math.random() - 0.5),
  [question.id, options.length]);

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="question-container">
      <div className="progress-section">
        <span className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="image-container">
        <img 
          src={`${import.meta.env.BASE_URL}${question.imageUrl.replace(/^\//, '')}`} 
          alt="Whose tree is this?" 
          className="question-image"
        />
      </div>
      
      <p className="question-prompt">Whose tree is this? 🎄</p>
      
      <div className="options-grid">
        {shuffledOptions.map((option, index) => (
          <button
            key={option}
            onClick={() => onAnswer(question.id, option)}
            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {option}
            {selectedAnswer === option && (
              <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
