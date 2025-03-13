import { Input, Form, Button } from 'reactstrap';
import { useState } from 'react';

function Login({ setUser }) {
  const [formdata, setFormData] = useState(false);

  const getUser = async () => {
    try {
      const response = await fetch(`https://localhost:9926/Users/${formdata}`);
      const user = await response.json();
      setUser(user);
    } catch(e) {
      setUser({ error: 'user not found' });
    }
  }

  return (
    <Form className="login">
      <Input type="text" className="mb-2 text-center" onChange={(e) => setFormData(e.target.value)} />
      <Button block color="success" onClick={getUser}>Log In</Button>
    </Form>
  );
}

export default Login;
