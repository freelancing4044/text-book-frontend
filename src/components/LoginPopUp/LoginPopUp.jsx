import React, { useContext, useState, useEffect } from "react";
import "./LoginPopUp.css";
import { cross } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setAuth } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Set focus to the first input when the modal opens
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setError("");
    setData({ name: "", email: "", password: "" });
    setCurrState(prev => prev === "Login" ? "Sign Up" : "Login");
  };

  const handleClose = () => {
    setError("");
    setShowLogin(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = currState === "Login" ? "/api/users/login" : "/api/users/register";
      const response = await axios.post(`${url}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data?.success) {
        const { token, user } = response.data.data || {};
        if (!token) {
          throw new Error("No token received from server");
        }
        
        setAuth(token, user || null);
        handleClose();
      } else {
        throw new Error(response.data?.message || "Authentication failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Authentication error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isMounted) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMounted]);

  return (
    <div 
      className="login-popup" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="login-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <form onSubmit={onSubmit} className="login-popup-container" noValidate>
        <div className="login-popup-title">
          <h2 id="login-modal-title">
            {currState === "Login" ? "Welcome Back!" : "Create Account"}
          </h2>
          <button 
            type="button"
            onClick={handleClose}
            aria-label="Close login"
            className="close-button"
            disabled={isLoading}
          >
            <img src={cross} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="login-popup-inputs">
          {error && (
            <div className="error-message-loginpopup" role="alert">
              {error}
            </div>
          )}

          {currState === "Sign Up" && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                required
                aria-required="true"
                autoComplete="name"
                disabled={isLoading}
                autoFocus={currState === "Sign Up"}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
              required
              aria-required="true"
              autoComplete="email"
              disabled={isLoading}
              autoFocus={currState === "Login"}
            />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>
              {currState === "Sign Up" && (
                <span className="hint">(minimum 8 characters)</span>
              )}
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              required
              aria-required="true"
              minLength={8}
              autoComplete={currState === "Login" ? "current-password" : "new-password"}
              disabled={isLoading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : currState === "Sign Up" ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>

        <div className="form-footer">
          <p>
            {currState === "Login" ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="toggle-form-button"
              onClick={toggleForm}
              disabled={isLoading}
            >
              {currState === "Login" ? " Sign up" : " Sign in"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPopUp;
