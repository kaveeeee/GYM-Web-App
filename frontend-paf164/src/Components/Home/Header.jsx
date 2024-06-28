import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logo">
            <Link to="#">
              <img src="assets/logo.png" alt="logo" />
              PowerPlus+
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li className="link">
            <Link to="#home">Home</Link>
          </li>
          <li className="link">
            <Link to="/about">
              About Us
            </Link>
          </li>
          {/* <li className="link">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community");
                } else {
                  setIsAuthModalOpened(true);
                }
              }}
              className="btn"
            >
             Fitness Programs
            </button>
          </li> */}
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div className="header__image">
          <img src="assets/header.png" alt="header" />
        </div>
        <div className="header__content">
          <h4>Elevate Your Fitness Odyssey</h4>
          <h1 className="section__header">Master Your Fitness Journey!</h1>
          <p> Ready to sculpt your physique, boost endurance, and feel incredible? GymFlex offers tailored workouts and professional guidance to help you achieve your fitness ambitions.</p>
          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community");
                } else {
                  setIsAuthModalOpened(true);
                }
              }}
              className="btn"
            >
             PowerPlus+
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;
