// src/App.jsx
import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Admin from './components/Admin';
import './index.css';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/admin') {
    return <Admin />;
  }

  return <Quiz />;
}
