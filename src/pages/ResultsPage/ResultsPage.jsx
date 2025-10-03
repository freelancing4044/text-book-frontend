import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [testTitle, setTestTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get result data from navigation state
    if (location.state?.result) {
      console.log('Received result data:', location.state.result);
      
      // Ensure we have the expected data structure
      const resultData = location.state.result;
      
      if (!resultData.score && resultData.score !== 0) {
        setError('Invalid result data format: missing score');
        setLoading(false);
        return;
      }
      
      setResult(resultData);
      setTestTitle(location.state.testTitle || resultData.testTitle || 'Test Results');
      setLoading(false);
    } else {
      console.error('No result data found in location state:', location.state);
      setError('No results found. Please complete a test first.');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return <div className="results-container"><h2>Loading results...</h2></div>;
  }

  if (error) {
    return (
      <div className="results-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1>{testTitle} - Results</h1>
      
      <div className="score-summary">
        <h2>Test Summary</h2>
        <div className="score-details">
          <div className="score-box">
            <h3>Score</h3>
            <p className="score">{result.score} / {result.totalQuestions}</p>
          </div>
          <div className="score-box">
            <h3>Percentage</h3>
            <p className="percentage">{result.percentage.toFixed(2)}%</p>
          </div>
          <div className="score-box">
            <h3>Time Taken</h3>
            <p className="time-taken">
              {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
            </p>
          </div>
        </div>
      </div>

      <div className="answers-section">
        <h2>Question-wise Analysis</h2>
        {result.answers && Array.isArray(result.answers) && result.answers.length > 0 ? (
          <div className="answers-list">
            {result.answers.map((answer, index) => {
              // Ensure answer has required properties
              if (!answer || typeof answer !== 'object') {
                console.error(`Invalid answer at index ${index}:`, answer);
                return null;
              }
              
              const options = Array.isArray(answer.options) ? answer.options : [];
              const selectedIndex = Number(answer.selectedOptionIndex);
              const correctIndex = Number(answer.correctAnswerIndex);
              
              return (
                <div 
                  key={index} 
                  className={`answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <h4>Question {index + 1}</h4>
                  <p>Your answer: {options[selectedIndex] || 'No answer selected'}</p>
                  {!answer.isCorrect && options[correctIndex] && (
                    <p>Correct answer: {options[correctIndex]}</p>
                  )}
                  <p className="status">
                    {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No answers found.</p>
        )}
      </div>

      <div className="actions">
        <button 
          className="btn-primary"
          onClick={() => navigate('/test-series')}
        >
          Back to Test Series
        </button>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
