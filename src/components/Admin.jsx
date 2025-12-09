// src/components/Admin.jsx
import { useState } from 'react';
import { getScores, ADMIN_PASSWORD } from '../utils/api';
import { questions } from '../data/questions';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleLogin = async () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoading(true);
      setError('');
      try {
        const data = await getScores(password);
        if (Array.isArray(data)) {
          setScores(data);
        } else {
          setScores([]);
        }
      } catch (err) {
        setError('Failed to load scores');
      }
      setLoading(false);
    } else {
      setError('Incorrect password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleViewAnswers = (playerData) => {
    setSelectedPlayer(playerData);
  };

  const handleCloseAnswers = () => {
    setSelectedPlayer(null);
  };

  if (!authenticated) {
    return (
      <div className="admin-container">
        <div className="admin-login-card">
          <div className="admin-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1>Admin Access</h1>
          <p>Enter the admin password to view scores</p>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="admin-input"
            />
            <button onClick={handleLogin} className="admin-button">
              Unlock
            </button>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <a href="#/" className="back-link">← Back to Quiz</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading scores...</p>
        </div>
      </div>
    );
  }

  // Show answer breakdown if a player is selected
  if (selectedPlayer) {
    let playerAnswers = {};
    try {
      playerAnswers = typeof selectedPlayer.answers === 'string' 
        ? JSON.parse(selectedPlayer.answers) 
        : selectedPlayer.answers || {};
    } catch (e) {
      playerAnswers = {};
    }

    // Create a map of question ID to question for easy lookup
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    return (
      <div className="admin-container">
        <div className="admin-panel">
          <div className="admin-header">
            <h1>{selectedPlayer.playerName}'s Answers</h1>
            <button onClick={handleCloseAnswers} className="back-button">
              ← Back to Leaderboard
            </button>
          </div>

          <div className="player-score-summary">
            <div className="summary-stat">
              <span className="summary-label">Score</span>
              <span className="summary-value">{selectedPlayer.score}/{selectedPlayer.total}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Percentage</span>
              <span className="summary-value">{selectedPlayer.percentage}%</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Date</span>
              <span className="summary-value">
                {selectedPlayer.timestamp ? new Date(selectedPlayer.timestamp).toLocaleString() : '-'}
              </span>
            </div>
          </div>

          <div className="breakdown-list">
            {questions.map((question, index) => {
              const userAnswer = playerAnswers[question.id];
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
                        You said: <strong>{userAnswer || 'No answer'}</strong>
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

  // Calculate stats
  const totalPlayers = scores.length;
  const avgScore = totalPlayers > 0 
    ? Math.round(scores.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalPlayers) 
    : 0;
  const topScore = totalPlayers > 0 
    ? Math.max(...scores.map(s => s.percentage || 0)) 
    : 0;

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Leaderboard</h1>
          <a href="#/" className="back-link">← Back to Quiz</a>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalPlayers}</span>
            <span className="stat-label">Players</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{avgScore}%</span>
            <span className="stat-label">Average</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{topScore}%</span>
            <span className="stat-label">Top Score</span>
          </div>
        </div>

        {scores.length === 0 ? (
          <div className="no-scores">
            <p>No scores recorded yet.</p>
            <p className="hint">Scores will appear here once players complete the quiz.</p>
          </div>
        ) : (
          <div className="scores-table-container">
            <table className="scores-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>%</th>
                  <th>Time</th>
                  <th>Answers</th>
                </tr>
              </thead>
              <tbody>
                {scores
                  .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
                  .map((s, i) => (
                    <tr key={i} className={i < 3 ? `rank-${i + 1}` : ''}>
                      <td className="rank-cell">
                        {i === 0 && '🥇'}
                        {i === 1 && '🥈'}
                        {i === 2 && '🥉'}
                        {i > 2 && i + 1}
                      </td>
                      <td className="name-cell">{s.playerName}</td>
                      <td>{s.score}/{s.total}</td>
                      <td className="percentage-cell">{s.percentage}%</td>
                      <td className="time-cell">
                        {s.timestamp ? new Date(s.timestamp).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleViewAnswers(s)}
                          className="view-answers-button"
                        >
                          View Answers
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
