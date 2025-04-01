import { Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import axios from 'axios';

function TopNav() {
  const navigate = useNavigate();
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  const runDraft = async () => {
    await axios.get(`https://localhost:9926/draft`);
    const response = await axios.get(`https://localhost:9926/getUser/${persistedUser.id}`);
    if (response) {
      setPersistedUser(response.data);
    }
  }

  return persistedUser && (
    <Navbar id="app-nav" dark fixed="top" expand="xs">
      <NavbarBrand>
        <div id="logo" title="Go to Organizations Home" />

      </NavbarBrand>
      {window.location.host.indexOf('localhost') !== -1 && (
        <Button color="success" onClick={runDraft}>Run Demo Draft</Button>
      )}
      <Nav>
        <NavItem>
          <NavLink to={'/properties'}>Properties</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={'/profile'}>Profile</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={'/marketplace'}>Marketplace</NavLink>
        </NavItem>
        <NavItem>
          <a onClick={() => {
            setPersistedUser(false);
            navigate(`/`)
          }}>Log Out</a>
        </NavItem>
      </Nav>
    </Navbar>
  );
}

export default TopNav;
