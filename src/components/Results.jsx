// src/components/Results.jsx

export default function Results({ score, total, playerName, questions, answers }) {
  const percentage = Math.round((score / total) * 100);
  
  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect Score!", emoji: "🏆" };
    if (percentage >= 80) return { text: "Outstanding!", emoji: "🌟" };
    if (percentage >= 60) return { text: "Great Job!", emoji: "👏" };
    if (percentage >= 40) return { text: "Not Bad!", emoji: "👍" };
    return { text: "Keep Learning!", emoji: "📚" };
  };

  const message = getMessage();

  return (
    <div className="results-container">
      <div className="results-main">
        <div className="results-card">
          <div className="results-emoji">{message.emoji}</div>
          <h1 className="results-title">Quiz Complete!</h1>
          <p className="player-name">{playerName}</p>
          
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{total}</span>
            </div>
            <div className="percentage-bar">
              <div 
                className="percentage-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="percentage-text">{percentage}%</span>
          </div>
          
          <p className="results-message">{message.text}</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="play-again-button"
          >
            <span>Play Again</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="results-breakdown">
        <h2 className="breakdown-title">Your Answers</h2>
        <div className="breakdown-list">
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            const imageUrl = `${import.meta.env.BASE_URL}${question.imageUrl.replace(/^\//, '')}`;
            
            return (
              <div key={question.id} className={`breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="breakdown-thumbnail">
                  <img src={imageUrl} alt={`Question ${index + 1}`} />
                </div>
                <div className="breakdown-info">
                  <div className="breakdown-status">
                    {isCorrect ? (
                      <span className="status-correct">✓ Correct</span>
                    ) : (
                      <span className="status-incorrect">✗ Wrong</span>
                    )}
                  </div>
                  <div className="breakdown-answer">
                    <span className="your-answer">
                      You said: <strong>{userAnswer}</strong>
                    </span>
                    {!isCorrect && (
                      <span className="correct-answer">
                        Answer: <strong>{question.correctAnswer}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
