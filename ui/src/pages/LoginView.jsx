import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 120px;
  width: auto;
`;

const InfoText = styled.div`
  color: #666;
  margin-top: -00px;
`;

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
        const response = await axios.get(`https://localhost:9926/getUser?email=${loginresponse.data.email}`);
        if (response) {
          setPersistedUser(response.data);
          setTimeout(() => navigate('/profile'), 1);
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
    <LoginContainer onClick={googleLogin}>
      <Logo src="/logo.png" alt="Logo" />
      <InfoText>{error || 'click to sign in with google'}</InfoText>
    </LoginContainer>
  );
}

export default LoginView;
