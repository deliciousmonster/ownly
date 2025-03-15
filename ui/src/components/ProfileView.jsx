import { Row, Col, Button } from 'reactstrap';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move';
import axios from 'axios';
import useLocalStorageState from 'use-local-storage-state';
import Countdown from 'react-countdown';
import { useEffect, useState } from 'react';

function ProfileView() {
  const [lockStatus, setLockStatus] = useState({ locked: '-', total: '-' });
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });
  const years = Array.from({ length: 8 }, (_, i) => [i + 2026, i + persistedUser.priority > 8 ? i + persistedUser.priority - 8 : i + persistedUser.priority]);

  const getLockStatus = async () => {
    const { data: { locked, total }} = await axios.get(`https://localhost:9926/lockstatus`);
    setLockStatus({ locked, total });
  }

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
    await getLockStatus();
  }

  useEffect(() => {
    getLockStatus();
  }, [])

  return (
    <Row id="profile">
      <Col md="6" xs="12">
        <h5>1. Prioritize Your Weeks</h5>
        <hr />
        <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="card" lockAxis="y">
          {persistedUser?.weeks?.map((week) =>  (
            <SortableItem key={week.id}>
              <div className="card">
                  <Row>
                    <Col className="weeks">
                      <b>Weeks {week.label.weeks}</b>
                    </Col>
                    <Col className="label">
                      {week.label.description}
                    </Col>
                  </Row>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      </Col>
      <Col md="6" xs="12">
        <h5>2. Set Your Usage Preferences</h5>
        <hr />
        <div className="card mb-4 pt-3">
            <b>Decide how you'd like to use your 6 weeks.</b>
            <hr />
            <div className="radio-button">
              <input type="radio" name="blocks" id="3" value="3" checked={persistedUser.blocks === 3} onChange={updateBlocks} disabled={persistedUser.locked} />
              <b>3 Blocks:</b> 2 Weeks Each.
            </div>

            <div className="radio-button">
              <input type="radio" name="blocks" id="2" value="2" checked={persistedUser.blocks === 2} onChange={updateBlocks} disabled={persistedUser.locked} />
              <b>2 Blocks:</b> 1 Two Week Block. 1 Four Week Block.
            </div>

            <div className="radio-button">
              <input type="radio" name="blocks" id="1" value="1" checked={persistedUser.blocks === 1} onChange={updateBlocks} disabled={persistedUser.locked}/>
              <b>One Block:</b> All 6 Weeks At Once.
            </div>
        </div>
        <h5>3. Understand Your Priority</h5>
        <hr />
        <div className="card mb-4 pt-3">
          <b>Priority rotates yearly. You can offer to trade priority in the marketplace.</b>
          <hr />
          <div className="years">
            {years.map((y) => (
              <div className="year" key={y[0]}><b>{y[0]}</b>: {y[1]}</div>
            ))}
          </div>
        </div>
        <h5>4. Lock In Your Choices</h5>
        <hr />
        <div className="card pt-3">
          <b>We'll run our allocator once all owners have locked their choices</b>
          <hr />
          {persistedUser.locked ? (
            <Button block color="danger" onClick={() => lockPreferences(false)}>Unlock My Week And Usage Preferences</Button>
          ) : (
            <Button block color="success" onClick={() => lockPreferences(true)}>Lock My Week And Usage Preferences</Button>
          )}
          <hr />
          <Row>
            <Col xs="12" md="7">
              <Countdown date={1742223600000} renderer={({ days, hours, minutes, completed }) =>
                completed ? (
                  <Row className="pb-3">
                    <Col className="text-center">
                      <h4>GameTime</h4>
                      Draft is in progress
                    </Col>
                  </Row>
                ) : (
                  <Row className="pb-3">
                    <Col className="text-center">
                      <h4>{days}</h4>
                      days
                    </Col>
                    <Col className="text-center">
                      <h4>{hours}</h4>
                      hours
                    </Col>
                    <Col className="text-center">
                      <h4>{minutes}</h4>
                      minutes
                    </Col>
                  </Row>
                )} />
            </Col>
            <Col xs="12" md="5">
              <Row className="pb-3">
                <Col className="text-center">
                  <h4>{lockStatus.locked}/{lockStatus.total}</h4>
                  Owners Locked
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}

export default ProfileView;
