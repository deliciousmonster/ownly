import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import useLocalStorageState from 'use-local-storage-state';

function MarketplaceView() {
  const [allocations, setAllocations] = useState([]);
  const [persistedUser] = useLocalStorageState('persistedUser', { defaultValue: false });

  const getAllocations = async () => {
    const response = await axios.get(`https://localhost:9926/Users/?select(id,name,totalValue,allocations)`);
    if (response?.data[0].allocations) {
      const orderedWeeks = [];
      response.data.map((user) => {
        const userAllocations = user.allocations?.map((a) => ({ ...a, name: user.name, userid: user.id }));
        orderedWeeks.push(...userAllocations);
      });
      setAllocations(orderedWeeks.sort((a, b) => a.id - b.id));
    }
  }

  useEffect(() => {
    getAllocations();
  }, [])

  console.log(persistedUser);
  console.log(allocations);

  return (
    <Row id="calendar" className="mb-5">
      <Col md="8" xs="12">
        <h6>Assignments For 2026</h6>
        <div className="card listholder my-4 pt-3">
          <div className="list">
            {allocations.length ? allocations.map((week) =>  (
              <div className="card listitem" key={week.id}>
                <Row>
                  <Col className="weeks">
                    <b>{week.start} - {week.end}</b>
                  </Col>
                  <Col className="description">
                    {week.description}
                  </Col>
                  <Col className="name">
                    {week.name}
                  </Col>
                  <Col className="button">
                    {persistedUser.id === week.userid && (<Button size="sm" color="success">rent</Button>)}
                  </Col>
                  <Col className="button">
                    {persistedUser.id === week.userid && (<Button size="sm" color="success">trade</Button>)}
                  </Col>
                </Row>
              </div>
            )) : (
              <div>The draft has not yet been run. Please check back soon!</div>
            )}
          </div>
        </div>
      </Col>
      <Col md="4" xs="12">
        <h6>Trade Weeks</h6>
        {allocations.length ? (
          <div className="card my-4 pt-3">
            1. Select one of your weeks from the list.
            <div className="dragDrop">select a week</div>
            <hr />
            2. Select another owner&apos;s week to trade for..
            <div className="dragDrop">select a week</div>
            <hr />
            3. Even the trade (estimated value provided).
            <Input type="text" className="text-center mt-2" defaultValue="$500.00" />
            <hr />
            <Button block color="success">Propose Trade</Button>
          </div>
        ) : (
          <div className="card my-4 pt-3">Trade weeks with other owners.</div>
        )}
        <h6>Rent Weeks</h6>
        {allocations.length ? (
          <div className="card my-4 pt-3">
            1. Select one of your weeks from the list.
            <div className="dragDrop">select a week</div>
            2. Enter a target rental price for your week
            <Input type="text" className="text-center mt-2" defaultValue="$1500.00" />
            <hr />
            <Button block color="success">List Rental</Button>
          </div>
        ) : (
          <div className="card my-4 pt-3">Put your week up for rent.</div>
        )}
      </Col>
    </Row>
  );
}

export default MarketplaceView;
