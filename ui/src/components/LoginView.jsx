import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';

function LoginView() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loginresponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );
      if (loginresponse.data.email) {
        const response = await axios.get(`https://${window.location.indexOf('localhost') !== -1 ? 'localhost' : 'cloud-jaxonrepp.harperdbcloud.com'}:9926/Users?email=${loginresponse.data.email}&select(id)`);
        if (response.data[0]) {
          setPersistedUser({ id: response.data[0] });
          navigate('/properties');
        } else {
          setError('You are not authorized to use this application.')
        }
      } else {
        setError('Google Login Failed.')
      }
    },
    onError: errorResponse => setError(errorResponse),
  });

  return (
    <div id="login" onClick={googleLogin}>
      <div id="background"></div>
      <div id="border-box"></div>
      <div className="logo">
        <img src="/logo.png" alt="Logo" height="100" />
        <span className="text-white">{error || 'click to sign in with google'}</span>
      </div>
    </div>
  );
}

export default LoginView;
