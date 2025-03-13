import { useState } from 'react';
import { Navbar, NavbarBrand, Button } from 'reactstrap';

import Admin from './Admin.jsx';
import Login from './Login.jsx';

function App() {
  const [user, setUser] = useState(false);

  return (
    <>
      <div id="app">
        <Navbar id="app-nav" dark fixed="top" expand="xs">
          <NavbarBrand>
            <div id="logo" title="Go to Organizations Home" />
          </NavbarBrand>
          {user && !user.error && (<Button color="black" onClick={() => setUser(false)}><span className="text-white">LOG OUT</span></Button>)}
        </Navbar>
        <div id="app-container">
          { !user || user.error ? (
            <>
              <Login setUser={setUser} />
              <div className="text-danger text-center mt-2">{user.error}</div>
            </>
          ) : (
            <Admin userRecord={user}/>
          )}
        </div>
      </div>
      <div id="app-bg-color" />
      <div id="app-bg-dots" />
    </>
  );
}

export default App;
