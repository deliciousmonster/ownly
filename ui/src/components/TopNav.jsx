import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';

function TopNav() {
  const navigate = useNavigate();
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  return persistedUser && (
    <Navbar id="app-nav" dark fixed="top" expand="xs">
      <NavbarBrand>
        <div id="logo" title="Go to Organizations Home" />
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink to={'/properties'}>Properties</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={'/calendar'}>Calendar</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to={'/profile'}>Profile</NavLink>
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
