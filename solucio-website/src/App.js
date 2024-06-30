import React from 'react';
import { ClerkProvider, useClerk } from '@clerk/clerk-react';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid SSR issues
const BrowserRouter = dynamic(() => import('react-router-dom').then(mod => mod.BrowserRouter), { ssr: false });
const Routes = dynamic(() => import('react-router-dom').then(mod => mod.Routes), { ssr: false });
const Route = dynamic(() => import('react-router-dom').then(mod => mod.Route), { ssr: false });
const Navigate = dynamic(() => import('react-router-dom').then(mod => mod.Navigate), { ssr: false });
const OnboardingPage = dynamic(() => import('./components/OnboardingPage'), { ssr: false });
const Dashboard = dynamic(() => import('./components/Dashboard'), { ssr: false });

// Ensure the environment variable is set, or throw an error
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Home component to handle redirection based on authentication
const Home = () => {
  const { session } = useClerk();

  if (session && session.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/onboardingpage" replace />;
};

// Simple constant page component
const OnboardingPageConst = () => {
  return <div>Welcome to Solucio AI</div>;
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// App component with dynamic routing
const App = ({ openaikey, googleMapsApiKey, mongoUri }) => {
  return (
    <div className="app-container">
      <div className="content-container">
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboardingpage" element={<OnboardingPageConst />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="*"
                element={<Navigate to="/onboardingpage" replace />} // Redirect to '/onboardingpage' for any unmatched routes
              />
            </Routes>
          </BrowserRouter>
        </ClerkProvider>
      </div>
    </div>
  );
};

export default App;
