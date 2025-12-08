// src/components/Admin.jsx
import { useState } from 'react';
import { getScores, ADMIN_PASSWORD } from '../utils/api';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

