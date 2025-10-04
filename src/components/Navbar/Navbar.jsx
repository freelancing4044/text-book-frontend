import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logo, profileIcon } from '../../assets/assets';
import './Navbar.css';
import { StoreContext } from '../../context/StoreContext';
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiChevronUp, FiUserCheck, FiAlertTriangle } from 'react-icons/fi';


const Navbar = ({setShowLogin}) => {
      const { token, user, clearAuth } = useContext(StoreContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState('/');
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close profile dropdown when toggling menu on mobile
    if (window.innerWidth <= 992) {
      setIsProfileDropdownOpen(false);
    }
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // Close mobile menu when opening profile dropdown on mobile
    if (window.innerWidth <= 992) {
      document.body.classList.toggle('no-scroll');
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutTimerRef = useRef(null);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    // Auto-hide the confirmation after 5 seconds
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      setShowLogoutConfirm(false);
    }, 5000);
  };

  const confirmLogout = () => {
    clearAuth();
    setIsProfileDropdownOpen(false);
    setShowLogoutConfirm(false);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };
  
  const isActive = (path) => {
    if (path === '/') {
      return activePath === path ? 'active' : '';
    }
    return activePath.startsWith(path) ? 'active' : '';
  };

  // Close menu when clicking on a nav item on mobile
  const handleNavItemClick = () => {
    if (window.innerWidth <= 992) {
      setIsMenuOpen(false);
      document.body.classList.remove('no-scroll');
    }
  };

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 992 && isMenuOpen && !e.target.closest('.nav-container')) {
        setIsMenuOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    if (window.innerWidth <= 992) {
      if (isMenuOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" onClick={cancelLogout}>
          <div className="logout-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="logout-confirm-content">
              <div className="logout-confirm-icon">
                <FiAlertTriangle size={32} />
              </div>
              <h3 className="logout-confirm-title">Confirm Logout</h3>
              <p className="logout-confirm-message">Are you sure you want to log out?</p>
              <div className="logout-confirm-actions">
                <button 
                  className="logout-confirm-button cancel"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
                <button 
                  className="logout-confirm-button confirm"
                  onClick={confirmLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={handleNavItemClick}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} onClick={handleNavItemClick}>
          <Link to="/" className={`nav-item ${isActive('/')}`} onClick={handleNavItemClick}>Home</Link>
          <Link to="/exams" className={`nav-item ${isActive('/exams')}`} onClick={handleNavItemClick}>Exams</Link>
          <Link to="/test-series" className={`nav-item ${isActive('/test-series')}`} onClick={handleNavItemClick}>Test Series</Link>
          <Link to="/about" className={`nav-item ${isActive('/about')}`} onClick={handleNavItemClick}>About Us</Link>
          <Link to="/news" className={`nav-item ${isActive('/news')}`} onClick={handleNavItemClick}>What's New</Link>
          <div className="nav-buttons">
            {!token ? (
              <button className='btn-singup' onClick={() => setShowLogin(true)}>Sign In</button>
            ) : (
              <div className={`profile-container ${isProfileDropdownOpen ? 'active' : ''}`} ref={profileDropdownRef}>
                <div 
                  className="profile-trigger" 
                  onClick={toggleProfileDropdown} 
                  onKeyDown={(e) => e.key === 'Enter' && toggleProfileDropdown(e)} 
                  tabIndex={0}
                >
                  <div className="profile-avatar">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} />
                    ) : (
                      <span className="avatar-fallback">{getUserInitials(user?.name)}</span>
                    )}
                  </div>
                  <span className="profile-name">{user?.name?.split(' ')[0] || 'User'}</span>
                  {isProfileDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {isProfileDropdownOpen && user && (
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} />
                        ) : (
                          <div className="avatar-fallback large">
                            {getUserInitials(user?.name)}
                          </div>
                        )}
                      </div>
                      <div className="user-info">
                        <h4 className="dropdown-user-name">{user.name}</h4>
                        <p className="dropdown-user-email">{user.email}</p>
                        {user.role && (
                          <span className="user-role">
                            <FiUserCheck /> {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/profile" className="dropdown-item"  onClick={() => {setIsProfileDropdownOpen(false);handleNavItemClick()}}>
                      <FiUser className="dropdown-icon" />
                      <span>My Profile</span>
                    </Link>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-item logout-item" onClick={()=>{handleLogout();handleNavItemClick()}}>
                      <FiLogOut className="dropdown-icon" />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
