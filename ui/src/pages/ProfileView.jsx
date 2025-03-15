import styled from 'styled-components';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move';
import axios from 'axios';
import useLocalStorageState from 'use-local-storage-state';
import { useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: white;
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Column = styled.div`
  flex: 1;
  padding: 20px;
  border-right: 1px solid #424242;
  
  &:last-child,
  &.week {
    border-right: none;
  }
  
  &.week {
    max-width: 150px;
    white-space: nowrap;
  }

  &.label {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
  
  &.week,
  &.label {
    padding: 5px;
  }
`;

const Card = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #efefef;
  padding: 5px 15px;
  margin-bottom: 5px;
  text-align: left;
  border-radius: 6px;
`;

export const Subhead = styled.label`
  display: block;
  padding: 15px 0;
  margin-bottom: 15px;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const Paragraph = styled.p`
  color: #efefef;
  line-height: 1rem;
  margin: 5px;
`;

export const RadioBox = styled.div`
  height: 1.125rem;
  width: 1.125rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.4rem;
  transition: background 0.15s, border-color 0.15s;
  padding: 2px;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: #efefef;
    border-radius: 50%;
    cursor: pointer;
    transform: scale(0);
  }
`;

export const Input = styled.input`
  display: none;
  &:checked + ${RadioBox} {
      &::after {
        transform: scale(1);
      }
`;

export const Years = styled.label`
  display: flex;
  flex-wrap: wrap;
`;

export const Year = styled.label`
  margin-bottom: 15px;
  flex: 1 1 25%;
`;

const LockButton = styled.button`
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #efefef;
  padding: 15px;
  text-align: center;
  display: block;
  border-radius: 6px;
  margin-bottom: 15px;
  width: 100%;
  cursor: pointer;
`;

function ProfileView() {
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });
  const years = Array.from({ length: 8 }, (_, i) => [i + 2026, i + persistedUser.priority > 8 ? i + persistedUser.priority - 8 : i + persistedUser.priority]);

  const onSortEnd = async (oldIndex, newIndex) => {
    if(!persistedUser.locked) {
      const newUser = { ...persistedUser };
      newUser.weeks = arrayMoveImmutable(newUser.weeks, oldIndex, newIndex);
      setPersistedUser(newUser);
      await axios.put(`https://localhost:9926/Users/${newUser.id}`, newUser);
    }
  }

  const updateBlocks = async (e) => {
    if(!persistedUser.locked) {
      const newUser = { ...persistedUser };
      newUser.blocks = parseInt(e.target.value, 10);
      setPersistedUser(newUser);
      await axios.put(`https://localhost:9926/Users/${newUser.id}`, newUser);
    }
  }

  const lockPreferences = async (value) => {
    const newUser = { ...persistedUser };
    newUser.locked = value;
    setPersistedUser(newUser);
    await axios.put(`https://localhost:9926/Users/${newUser.id}`, newUser);
  }

  return (
    <Container>
      <ColumnsContainer>
        <Column>
          <h2>1. Prioritize Your Weeks</h2>
          <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged" lockAxis="y">
            {persistedUser?.weeks?.map((week) =>  (
              <SortableItem key={week.weeks}>
                <Card>
                  <ColumnsContainer>
                    <Column className="week"><b>Weeks {week.weeks}</b></Column>
                    <Column className="label">{week.label}</Column>
                  </ColumnsContainer>
                </Card>
              </SortableItem>
            ))}
          </SortableList>
        </Column>
        <Column>
          <h2>2. Set Your Usage Preferences</h2>
          <Card>
              <Subhead>Decide how you'd like to use your 6 weeks.</Subhead>
              <Label id="3">
                <Input type="radio" name="blocks" id="3" value="3" checked={persistedUser.blocks === 3} onChange={updateBlocks} disabled={persistedUser.locked} />
                <RadioBox></RadioBox>
                <Paragraph><b>3 Blocks:</b> 2 Weeks Each.</Paragraph>
              </Label>

              <Label id="berlin">
                <Input type="radio" name="blocks" id="2" value="2" checked={persistedUser.blocks === 2} onChange={updateBlocks} disabled={persistedUser.locked} />
                <RadioBox></RadioBox>
                <Paragraph><b>2 Blocks:</b> 1 Two Week Block. 1 Four Week Block.</Paragraph>
              </Label>

              <Label id="tokyo">
                <Input type="radio" name="blocks" id="1" value="1" checked={persistedUser.blocks === 1} onChange={updateBlocks} disabled={persistedUser.locked}/>
                <RadioBox></RadioBox>
                <Paragraph><b>One Block:</b> All 6 Weeks At Once.</Paragraph>
              </Label>
          </Card>
          <Card>
            <Subhead>Your draft priority rotates every year. You can trade with another owner in the marketplace.</Subhead>
            <Years>
              {years.map((y) => (
                <Year key={y[0]}><b>{y[0]}</b>: {y[1]}</Year>
              ))}
            </Years>
          </Card>
          <br />
          <h2>3. Lock In Your Choices</h2>
          {persistedUser.locked ? (
            <LockButton onClick={() => lockPreferences(false)}>Unlock My Week And Usage Preferences</LockButton>
          ) : (
            <LockButton onClick={() => lockPreferences(true)}>Lock My Week And Usage Preferences</LockButton>
          )}
          We'll run our allocation draft once all owners have
        </Column>
      </ColumnsContainer>
    </Container>
  );
}

export default ProfileView;
