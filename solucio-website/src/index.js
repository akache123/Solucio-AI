import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import dynamic from '@loadable/component'; // Using loadable components for dynamic import

// Environment variables
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const googleMapsApiKey = process.env.GOOGLE_API_KEY;
const openaikey = process.env.OPENAI_API_KEY;

// Dynamically import the MapComponent with no SSR (client-side rendering)
const MapComponent = dynamic(() => import('./components/MapComponent'));

// Ensuring the DOM is fully loaded before rendering the application
if (typeof window !== 'undefined') {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <Router>
                    <App openaikey={openaikey} clerkPubKey={clerkPubKey} googleMapsApiKey={googleMapsApiKey}>
                        <MapComponent /> {/* Dynamically loaded MapComponent */}
                    </App>
                </Router>
            </React.StrictMode>
        );
    }
}
