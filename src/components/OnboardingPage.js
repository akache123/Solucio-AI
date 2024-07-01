import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import './Onboarding.module.css';

const OnboardingPage = () => {
  const [isSignUpPopupOpen, setSignUpPopupOpen] = useState(false);
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);

  const handleSignUpClick = () => {
    setSignUpPopupOpen(true);
    setSignInPopupOpen(false);
  };

  const handleSignInClick = () => {
    setSignInPopupOpen(true);
    setSignUpPopupOpen(false);
  };

  const handleClosePopup = () => {
    setSignUpPopupOpen(false);
    setSignInPopupOpen(false);
  };

  return (
    <div className="onboarding-page">
      <div className="cta-buttons">
        <button className="sign-up-btn" onClick={handleSignUpClick}>
          Sign Up
        </button>
        <button className="sign-in-btn" onClick={handleSignInClick}>
          Sign In
        </button>
      </div>

      {(isSignUpPopupOpen || isSignInPopupOpen) && (
        <div className="popup-overlay">
          {isSignUpPopupOpen && <SignUp onClose={handleClosePopup} />}
          {isSignInPopupOpen && <SignIn onClose={handleClosePopup} />}
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
