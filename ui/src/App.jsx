import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useLocalStorageState from 'use-local-storage-state';

import LoginView from './components/LoginView.jsx';
import PropertiesView from './components/PropertiesView.jsx';
import ProfileView from './components/ProfileView.jsx';
import Calendar from './components/MarketplaceView.jsx';
import TopNav from './components/TopNav.jsx';

import config from './config.js';

function App() {
  const [persistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <div id="app">
        <Router>
          <TopNav />
          <div id="app-container">
            <Routes>
              <Route path="/" element={persistedUser ? <ProfileView /> : <LoginView />} />
              <Route path="/properties/" element={persistedUser ? <PropertiesView /> :< Navigate to="/" replace /> } />
              <Route path="/profile/" element={persistedUser ? <ProfileView /> : <Navigate to="/" replace />} />
              <Route path="/marketplace/" element={persistedUser ? <Calendar /> : <Navigate to="/" replace />} />
              <Route path="*" element={persistedUser ? <Navigate to="/properties" replace /> : <Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>

      <div id="app-bg-color" className={persistedUser ? '' : 'login'}></div>
      <div id="app-bg-dots"></div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
