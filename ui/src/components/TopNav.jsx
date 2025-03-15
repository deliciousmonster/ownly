import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorageState from 'use-local-storage-state';

const NavContainer = styled.nav`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0;
`;

const NavLink = styled.button`
  background: none !important;
  border: none !important;
  color: #999;
  cursor: pointer;
  padding: 0.5rem 1rem;

  &:focus,
  &:active,
  &:hover {
    outline:0 !important;
    color: #efefef;
  }
`;

function TopNav() {
  const navigate = useNavigate();
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  return persistedUser && (
    <NavContainer>
      <Logo src="/logo.png" alt="Ownly" />
      <NavLinks>
        <NavLink onClick={() => navigate(`/properties`)}>Properties</NavLink>
        <NavLink onClick={() => navigate('/calendar')}>Calendar</NavLink>
        <NavLink onClick={() => navigate(`/profile`)}>Profile</NavLink>
        <NavLink onClick={() => {
          setPersistedUser(false);
          navigate(`/`)
        }}>Log Out</NavLink>
      </NavLinks>
      <div id="app-bg-dots"></div>
    </NavContainer>
  );
}

export default TopNav;
