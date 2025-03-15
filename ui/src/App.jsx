import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginView from './components/LoginView.jsx';
import PropertiesView from './components/PropertiesView.jsx';
import ProfileView from './components/ProfileView.jsx';
import Calendar from './components/CalendarView.jsx';
import TopNav from './components/TopNav.jsx';
import useLocalStorageState from 'use-local-storage-state';

function App() {
  const [persistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  return (
    <GoogleOAuthProvider clientId="524595955601-1un1gfmni825lie78anqd10rccvhfkcf.apps.googleusercontent.com">
      <div id="app">
        <Router>
          <TopNav />
          <div id="app-container">
            <Routes>
              <Route path="/" element={persistedUser ? <ProfileView /> : <LoginView />} />
              <Route path="/properties/" element={persistedUser ? <PropertiesView /> :< Navigate to="/" replace /> } />
              <Route path="/calendar/" element={persistedUser ? <Calendar /> : <Navigate to="/" replace />} />
              <Route path="/profile/" element={persistedUser ? <ProfileView /> : <Navigate to="/" replace />} />
              <Route path="*" element={persistedUser ? <Navigate to="/profile" replace /> : <Navigate to="/" replace />} />
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
