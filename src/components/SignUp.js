import React, { useEffect } from 'react';
import {SignedOut, SignUp, useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/router';
import './Onboarding.module.css'

const SignupPopup = ({ onClose }) => {
  const router = useRouter(); 
  const { session } = useClerk();

  const handleCloseClick = () => {
    onClose();
  };


  useEffect(() => {
    if (session && session.user) {
      router.push('/dashboard'); 
    }
  }, [session, router]);



  return (
    <SignedOut>
    <div className="popup-overlay">
      <div className="popup-content" style={popupStyles}>
        <button className="x-button" onClick={handleCloseClick}>
          X
        </button>
          <div className="clerk-signin-container">
              <SignUp>
              </SignUp>
          </div>
      </div>
    </div>
    </SignedOut>
  );
};

const popupStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.4)',
  overflow: 'hidden',
};

export default SignupPopup;
