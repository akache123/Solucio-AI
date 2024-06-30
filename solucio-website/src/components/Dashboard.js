import React, { useEffect } from 'react';
import { SignedIn, useClerk } from '@clerk/clerk-react';
import './Dashboard.module.css';

const Dashboard = ({ onClose }) => {
  const { signOut, user } = useClerk();  // Destructure `user` from the Clerk hook

  // Effect to log the user ID when it becomes available or changes
  useEffect(() => {
    if (user) {
      console.log('Clerk user ID:', user.id);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SignedIn>
      <div className="dashboard-container">
        <div className="analytics-section">
          <h2>Please Choose a Tab To Be Directed To</h2>
        </div>
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </SignedIn>
  );
};

export default Dashboard;
