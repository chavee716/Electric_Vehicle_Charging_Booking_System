import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle toggling dark mode
  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Apply dark mode class to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="Logo" />
        </a>
        <a href="/">Home</a>
        <a href="/map">Map</a>
        <a href="/about">About</a>
        <a href="/">Contact</a>
      </div>
      <div className="right">
        <button className="darkModeToggle" onClick={handleDarkModeToggle}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        {currentUser ? (
          <>
            <span className="username">{currentUser.username}</span>
            <div className="user">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt=""
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="profilePic"
              />
              {number > 0 && <div className="notification">{number}</div>}
              {dropdownOpen && (
                <div className="dropdownMenu">
                  <Link to="/profilePage" className="profileLink">
                    Profile
                  </Link>
                  <button className="logoutButton" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img src="/menu.png" alt="" onClick={() => setOpen((prev) => !prev)} />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          {currentUser ? (
            <>
              <Link to="/profilePage" className="profileLink">
                Profile
              </Link>
              <button className="logoutButton" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Sign in</a>
              <a href="/register">Sign up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
