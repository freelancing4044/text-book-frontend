import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && location.pathname.startsWith('/test/')) {
      // Store the intended destination before redirecting
      localStorage.setItem('redirectAfterLogin', location.pathname);
      // Set a flag to show login popup after redirect
      localStorage.setItem('showLoginOnLanding', 'true');
    }
  }, [token, location.pathname]);

  if (!token) {
    // Redirect to home page and show login popup
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
