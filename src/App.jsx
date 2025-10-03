import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing/Landing';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';
import Exams from './pages/Exams/Exams';

import Aboutus from './pages/Aboutus/Aboutus';
import News from './pages/News/News';
import LoginPopUp from './components/LoginPopUp/LoginPopUp';
import TestSeries from './pages/TestSeries/TestSeries';
import TestPage from './pages/TestPage/TestPage';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';

const App = () => {ToastContainer
  const [showLogin, setShowLogin] = useState(false);
  // const url = 'http://localhost:4000';
  const url = 'https://text-book-backend.onrender.com'
  const location = useLocation();
  const isTestPage = location.pathname.includes('/test/');

  useEffect(() => {
    // Check if we need to show login popup after redirect
    const shouldShowLogin = localStorage.getItem('showLoginOnLanding') === 'true';
    if (shouldShowLogin) {
      setShowLogin(true);
      // Clear the flag after showing the popup
      localStorage.removeItem('showLoginOnLanding');
    }
  }, []);

  return (
    <div className="app">
      <ScrollToTop/>
      {showLogin && <LoginPopUp url={url} setShowLogin={setShowLogin} />}
      {!isTestPage && !showLogin && <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />}
      
      <main className="main-content">
        <Routes>
          
          <Route path='/' element={<Landing />} />
          <Route path='/exams' element={<Exams/>}/>
          <Route path='/about' element={<Aboutus/>}/>
          <Route path='/news' element={<News url={url}/>}/>
          <Route path='/test-series' element={<TestSeries url={url}/>}/>
          <Route
            path='/test/:subject'
            element={
              <ProtectedRoute>
              
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route path='/results' element={<ResultsPage/>}/>
          <Route path='/profile' element={<Profile url={url}/>}/>
        </Routes>
      </main>
      {!isTestPage && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default App;
