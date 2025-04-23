import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import { Input, Button, InputGroup } from 'reactstrap';

import config from '../config.js';

const isEmail = (email) => {
  return String(email)
  .toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function LoginView() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  const emailLogin = async () => {
    if (isEmail(email)) {
      const response = await axios.get(`${config.API_URL}/users?email=${email}&select(id)`);
      if (response.data[0]) {
        setPersistedUser({ id: response.data[0] });
        navigate('/properties');
      } else {
        setError('you do not have access to this application')
      }
    } else {
      setError('please enter a valid email')
    }
  }

  return (
    <div id="login">
      <div id="background"></div>
      <div id="border-box"></div>
      <div className="logo">
        <img src="/logo.png" alt="Logo" height="100" />
        <InputGroup className="mt-3 mb-4" style={{ width: '299px' }}>
          <Input type="text" onChange={(e) => {
            setError(false);
            setEmail(e.target.value);
          }}></Input>
          <Button onClick={emailLogin}>GO</Button>
        </InputGroup>
        <span className="text-white">{error || 'please enter your email'}</span>
      </div>
    </div>
  );
}

export default LoginView;
