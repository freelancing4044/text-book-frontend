import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './Test.css';
import { StoreContext } from '../../context/StoreContext';


const TestPage = () => {
  // Hooks
  const { subject } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  // State Management
  const [testData, setTestData] = useState({
    questions: [],
    subject: '',
    duration: 0,
    pagination: {},
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [testSeed, setTestSeed] = useState(null);
  const [error, setError] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle fullscreen mode
  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    }
  }, []);

  

  // 1. Fetch Test Data
  const fetchTest = async (page = 1, limit = 20) => {
    try {
      const loadingState = page === 1 ? setIsLoading : setIsLoadingMore;
      loadingState(true);
      
      const response = await axios.get(`${url}/api/tests/${subject.toLowerCase()}`, {
        params: { page, limit, testSeed },
      });
      
      if (response.data?.status === 'success' && response.data.data) {
        const { questions, ...restData } = response.data.data;
        
        setTestData(prevData => ({
          ...restData,
          questions: page === 1 ? questions : [...prevData.questions, ...questions],
          pagination: response.data.data.pagination
        }));

        // Set timer on first load only
        if (page === 1) {
          const { duration, testSeed: newTestSeed } = response.data.data;
          const testDuration = typeof duration === 'number' ? duration : 60;
          setTimeLeft(testDuration * 60);
          setTestSeed(newTestSeed);
        }
      } else {
        throw new Error(response.data?.message || 'Invalid test data format');
      }
    } catch (err) {
      console.error('Error fetching test:', err);
      setError(err.response?.data?.message || 'Failed to load the test. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (url && subject) {
      fetchTest(1);
    }
  }, [subject, url]);

  // 2. Timer Logic
  useEffect(() => {
    if (!testData || timeLeft <= 0) {
      if (timeLeft === 0 && testData && testStarted) {
        handleSubmit(true);
      }
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, testData]);

  const handleOptionSelect = (questionId, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    // If we're near the end of current questions and there are more to load
    if (
      nextIndex >= testData.questions.length - 5 &&
      testData.pagination &&
      testData.pagination.currentPage < testData.pagination.totalPages &&
      !isLoadingMore
    ) {
      fetchTest(testData.pagination.currentPage + 1);
    }

    if (nextIndex < testData.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      // Mark next question as visited
      setVisitedQuestions(prev => new Set(prev).add(nextIndex));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      // Mark previous question as visited
      setVisitedQuestions(prev => new Set(prev).add(prevIndex));
    }
  };

  const handleMarkForReview = () => {
    if (!testData) return;
    const currentQuestionId = testData.questions[currentQuestionIndex]._id;
    if (markedForReview.includes(currentQuestionId)) {
      setMarkedForReview(markedForReview.filter((id) => id !== currentQuestionId));
    } else {
      setMarkedForReview([...markedForReview, currentQuestionId]);
    }
  };
  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
    // Mark question as visited
    setVisitedQuestions(prev => new Set(prev).add(index));
  };
  
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    if (!testData) {
      console.error('No test data available');
      setError('Test data is not available. Please refresh the page and try again.');
      return;
    }
    
    const formattedUserAnswers = Object.entries(userAnswers).map(([questionId, selectedOptionIndex]) => ({
      questionId,
      selectedOptionIndex: Number(selectedOptionIndex) || 0,
    }));

    if (!isAutoSubmit) {
      const totalQuestions = testData.pagination?.totalQuestions || testData.questions.length;
      const unAnsweredCount = totalQuestions - formattedUserAnswers.length;
      if (unAnsweredCount > 0 && !window.confirm(`You have ${unAnsweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      
      const submissionData = {
        testId: testData._id,
        userAnswers: formattedUserAnswers,
        timeTaken: Math.max(0, (testData.duration * 60) - timeLeft), // Ensure non-negative
      };

      console.log('Submitting test with data:', {
        submissionData,
        questionsCount: testData.questions?.length || 0,
        answersCount: submissionData.userAnswers.length,
      });
      
      const response = await axios.post(`${url}/api/tests/submit`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        validateStatus: (status) => status < 500, // Reject only server errors
      });
      
      console.log('Submission response:', {
        status: response.status,
        data: response.data,
      });
      
      if (response.status === 200 && response.data.status === 'success') {
        const resultData = response.data.data;
        
        if (!resultData) {
          throw new Error('No result data in response');
        }
        
        // Ensure all required fields are present in the result
        const formattedResult = {
          ...resultData,
          score: resultData.score || 0,
          totalQuestions: resultData.totalQuestions || testData.pagination?.totalQuestions || 0,
          percentage: resultData.percentage || 0,
          timeTaken: resultData.timeTaken || submissionData.timeTaken,
          answers: Array.isArray(resultData.answers) 
            ? resultData.answers.map(ans => ({
                ...ans,
                isCorrect: Boolean(ans.isCorrect),
                selectedOptionIndex: Number(ans.selectedOptionIndex) || 0,
                correctAnswerIndex: Number(ans.correctAnswerIndex) || 0,
                options: Array.isArray(ans.options) ? ans.options : [],
              }))
            : [],
          testTitle: testData.subject || 'Test Results',
        };
        
        console.log('Navigating to results with:', {
          result: formattedResult,
          testTitle: testData.subject || 'Test Results',
        });
        
        navigate('/results', { 
          state: { 
            result: formattedResult,
            testTitle: testData.subject || 'Test Results',
          },
          replace: true, // Replace current entry in history
        });
      } else {
        const errorMsg = response.data?.message || 'Invalid response format from server';
        console.error('Error from server:', errorMsg, response.data);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error submitting test:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      setError(`Error: ${err.message}. ${err.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [testData, userAnswers, timeLeft, url, token, navigate]);

  // Handle tab change detection
  useEffect(() => {
    if (!testStarted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Warn user and then submit
        alert('You have changed tabs/windows. The test will be submitted now.');
        handleSubmit(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted,handleSubmit]);
  

  // Show loading state
  if (isLoading) {
    return (
      <div className="test-loading-container">
        <div className="test-loading-content">
          <div className="spinner-container">
            <ClipLoader size={50} color={"#3498db"} loading={true} />
          </div>
          <h2>Loading Test Questions...</h2>
          <p>Please wait while we prepare your test</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="test-container">
        <div className="error-message">
          <h2>Error Loading Test</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // Show no questions message
  if (!testData || !testData.questions || testData.questions.length === 0) {
    return <div className="test-container"><h2>No questions found for this test.</h2></div>;
  }

  // Show instructions before test starts
  if (!testStarted) {
    return (
      <div className="test-instructions-container">
        <div className="test-instructions">
          <h2>Test Instructions</h2>
          <div className="instructions-content">
            <h3>Please read the following instructions carefully:</h3>
            <ol>
              <li>This test contains <strong>{testData.questions.length} questions</strong>.</li>
              <li>Total duration of the test is <strong>{testData.duration} minutes</strong>.</li>
              <li>There is <strong>no negative marking</strong> for wrong answers.</li>
              <li>You can navigate between questions using the question palette.</li>
              <li>Use the <strong>"Mark for Review"</strong> button to mark questions you want to review later.</li>
              <li>Questions you have marked for review will be highlighted in the question palette.</li>
              <li>You can change your answer anytime before submitting the test.</li>
              <li>The test will be automatically submitted when the time runs out.</li>
              <li className="warning">
                <strong>Important:</strong> Do not switch tabs or minimize the browser window during the test, 
                as this will result in an automatic submission.
              </li>
            </ol>
            <div className="test-actions">
              <button 
                className="start-test-btn"
                onClick={() => {
                  setTestStarted(true);
                  enterFullscreen();
                }}
              >
                Start Test
              </button>
              <button 
                className="cancel-test-btn"
                onClick={() => navigate('/')}
              >
                Cancel Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const isMarked = markedForReview.includes(currentQuestion._id);
  const totalQuestions = testData.pagination?.totalQuestions || testData.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = markedForReview.length;
  const unansweredCount = totalQuestions - answeredCount;

  // Navigation panel component
  const renderQuestionNavigation = () => (
    <div className="nav-panel">
      <div className="nav-panel-content">
        <div className="status-summary">
          <div className="status-item">
            <span className="status-dot answered"></span>
            <span>Answered: {answeredCount}</span>
          </div>
          <div className="status-item">
            <span className="status-dot marked"></span>
            <span>Marked: {markedCount}</span>
          </div>
          <div className="status-item">
            <span className="status-dot unattempted"></span>
            <span>Unanswered: {unansweredCount}</span>
          </div>
        </div>
        
        <h3>Questions</h3>
        <div className="question-grid">
          {testData.questions.map((q, index) => {
            const isAnswered = userAnswers[q._id] !== undefined;
            const isMarked = markedForReview.includes(q._id);
            const isCurrent = currentQuestionIndex === index;
            const isVisited = visitedQuestions.has(index);
            
            return (
              <div key={q._id} className="question-number-container">
                <button
                  className={`question-nav-btn ${
                    isCurrent ? 'current' : 
                    isMarked ? 'marked' : 
                    isAnswered ? 'answered' : 
                    isVisited ? 'visited' : 'unanswered'
                  }`}
                  onClick={() => handleQuestionJump(index)}
                >
                  {index + 1}
                </button>
                {isMarked && <div className="mark-indicator">M</div>}
              </div>
            );
          })}
        </div>
        
        <div className="load-more-container">
          {testData.pagination && testData.pagination.currentPage < testData.pagination.totalPages && (
            <button 
              className="load-more-btn" 
              onClick={() => fetchTest(testData.pagination.currentPage + 1)} 
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More Questions'}
            </button>
          )}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-color current"></div>
            <span>Current</span>
          </div>
          <div className="legend-item">
            <div className="legend-color answered"></div>
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-color marked"></div>
            <span>Marked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unattempted"></div>
            <span>Unanswered</span>
          </div>
        </div>
      </div>
      
      <button 
        className="submit-btn-final" 
        onClick={() => {
          const confirmSubmit = window.confirm('Are you sure you want to submit the test? You will not be able to make changes after submission.');
          if (confirmSubmit) {
            handleSubmit(false);
          }
        }}
      >
        Submit Test
      </button>
    </div>
  );

  const TestLogo = () => (
    <div className="test-logo-container">
      <div className="test-logo">
        <img src="/src/assets/icons/logo.webp" alt="Logo" className="logo-img" />
      </div>
    </div>
  );

  return (
    <div className="test-container">
      <TestLogo />
      <div className="test-header">
        <h1>{testData.subject.toUpperCase()} Test</h1>
        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
        </div>
      </div>

      <div className="test-body">
        <div className="question-area">
          <div className="question-content">
            <h3>Question {currentQuestionIndex + 1} of {totalQuestions}</h3>
            <p>{currentQuestion.questionText}</p>
          </div>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  id={`q${currentQuestion._id}-opt${index}`}
                  name={`question-${currentQuestion._id}`}
                  checked={userAnswers[currentQuestion._id] === index}
                  onChange={() => handleOptionSelect(currentQuestion._id, index)}
                />
                <label htmlFor={`q${currentQuestion._id}-opt${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
          
          <div className="question-actions">
            <button 
              onClick={handleMarkForReview} 
              className={isMarked ? 'unmark-btn' : 'mark-btn'}
            >
              {isMarked ? 'Unmark Review' : 'Mark for Review'}
            </button>
            <div className="nav-buttons">
              <button 
                onClick={handlePrevious} 
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
        </div>
        
        </div>
        
        {renderQuestionNavigation()}
      </div>
    </div>
  );
};

export default TestPage;