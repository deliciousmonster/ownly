import { Row, Col, Button } from 'reactstrap';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move';
import axios from 'axios';
import useLocalStorageState from 'use-local-storage-state';
import Countdown from 'react-countdown';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../config.js';

function ProfileView() {
  const navigate = useNavigate();
  const [lockStatus, setLockStatus] = useState({ locked: '-', total: '-' });
  const [persistedUser, setPersistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  const getLockStatus = async () => {
    const { data: { locked, total }} = await axios.get(`${config.API_URL}/lockstatus`);
    setLockStatus({ locked, total });
  }

  const onSortEnd = async (oldIndex, newIndex) => {
    if(!persistedUser.locked) {
      const newUser = { ...persistedUser };
      newUser.weeks = arrayMoveImmutable(newUser.weeks, oldIndex, newIndex);
      setPersistedUser(newUser);
      await axios.put(`${config.API_URL}/users/${newUser.id}`, newUser);
    }
  }

  const updateBlocks = async (e) => {
    if(!persistedUser.locked) {
      const newUser = { ...persistedUser };
      newUser.blocks = parseInt(e.target.value, 10);
      setPersistedUser(newUser);
      await axios.put(`${config.API_URL}/users/${newUser.id}`, newUser);
    }
  }

  const lockPreferences = async (value) => {
    const newUser = { ...persistedUser };
    newUser.locked = value;
    setPersistedUser(newUser);
    await axios.put(`${config.API_URL}/users/${newUser.id}`, newUser);
    await getLockStatus();
  }

  useEffect(() => {
    if (persistedUser) {
      const getUser = async () => {
        if (persistedUser) {
          const response = await axios.get(`${config.API_URL}/user/${persistedUser.id}`);
          if (response) {
            setPersistedUser(response.data);
          }
        }
      }
      getUser();
      getLockStatus();
    }
  }, [persistedUser, setPersistedUser])

  return (
    <Row id="profile">
      <Col md="6" xs="12">
        <h6>1. Prioritize Your Weeks</h6>
        <div className="card listholder my-4 pt-3">
          <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="card" lockAxis="y">
            {persistedUser?.weeks?.map((week) =>  (
              <SortableItem key={week.id}>
                <div className="card listitem">
                    <Row>
                      <Col className="weeks">
                        <b>{week.start} - {week.end}</b>
                      </Col>
                      <Col className="description">
                        {week.description}
                      </Col>
                    </Row>
                </div>
              </SortableItem>
            ))}
          </SortableList>
        </div>
      </Col>
      <Col md="6" xs="12">
        <h6>2. Set Your Usage Preferences</h6>
        <div className="card my-4 pt-3">
          <b>Decide how you&apos;d like to use your 6 weeks.</b>
          <hr />
          <Row>
            <Col>
              <div className="radio-button">
                <input type="radio" name="blocks" id="3" value="6" checked={true} onChange={updateBlocks} disabled={persistedUser.locked} />
                <b>6 Blocks:</b>&nbsp;1 Week Each.
              </div>
            </Col>
            <Col>
              <div className="radio-button">
                <input type="radio" name="blocks" id="2" value="3" checked={persistedUser.blocks === 3 && false} onChange={updateBlocks} disabled={true} />
                <b>3 Blocks:</b>&nbsp;(Coming Soon)
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="radio-button">
                <input type="radio" name="blocks" id="2" value="2" checked={persistedUser.blocks === 2 && false} onChange={updateBlocks} disabled={true} />
                <b>2 Blocks:</b>&nbsp;(Coming Soon)
              </div>
            </Col>
            <Col>
              <div className="radio-button">
                <input type="radio" name="blocks" id="1" value="1" checked={persistedUser.blocks === 1 && false} onChange={updateBlocks} disabled={true}/>
                <b>One Block:</b>&nbsp;(Coming Soon)
              </div>
            </Col>
          </Row>
        </div>
        <h6>4. Lock In Your Choices</h6>
        <div className="card my-4 pt-3">
          <Row>
            <Col xs="12" md="7">
              <Countdown date={'2025-04-04T12:00:00-07:00'} renderer={({ days, hours, minutes, completed }) =>
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
          {persistedUser.locked ? (
            <Button block className="my-3" color="danger" onClick={() => lockPreferences(false)}>Unlock My Week And Usage Preferences</Button>
          ) : (
            <Button block className="my-3" color="success" onClick={() => lockPreferences(true)}>Lock My Week And Usage Preferences</Button>
          )}
        </div>
        <h6>5. Review Your Allocated Weeks</h6>
        <div className="card my-4 pt-3">
          {persistedUser.allocations?.sort((a, b) => a.id - b.id).map((week) => (
            <div className="card" key={week.id}>
              <Row>
                <Col className="weeks">
                  <b>{week.start} - {week.end}</b>
                </Col>
                <Col className="label">
                  {week.description}
                </Col>
              </Row>
            </div>
          ))}
          <Button block className="my-3" color="success" onClick={() => navigate('/marketplace')}>View And Trade In Our Marketplace</Button>
        </div>
      </Col>
    </Row>
  );
}

export default ProfileView;
