import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';

function MarketplaceView() {
  const [allocations, setAllocations] = useState([]);

  const getAllocations = async () => {
    const response = await axios.get(`https://localhost:9926/Users/?select(name,totalValue,allocations)`);
    if (response?.data[0].allocations) {
      const orderedWeeks = [];
      response.data.map((user) => orderedWeeks.push(...user.allocations?.map((a) => ({ ...a, name: user.name }))));
      setAllocations(orderedWeeks.sort((a, b) => a.id - b.id));
    }
  }

  useEffect(() => {
    getAllocations();
  }, [])

  return (
    <Row id="calendar" className="mb-5">
      <Col md="8" xs="12">
        <h5>Assignments For 2026</h5>
        <hr />
        <div className="list">
          {allocations.length ? allocations.map((week) =>  (
            <div className="card" key={week.id}>
              <Row>
                <Col className="weeks">
                  <b>Weeks {week.label.weeks}</b>
                </Col>
                <Col className="description">
                  {week.label.description}
                </Col>
                <Col className="name">
                  {week.name}
                </Col>
                <Col className="button text-end">
                  <Button size="sm" color="success">trade</Button>
                </Col>
              </Row>
            </div>
          )) : (
            <div>The draft has not yet been run. Please check back soon!</div>
          )}
        </div>
      </Col>
      <Col md="4" xs="12">
        <h5>Marketplace</h5>
        <hr />
        {allocations.length ? (
          <div className="card mb-4 pt-3">
            <b>Safely trade weeks with other owners.</b>
            <hr />
            1. Select one of your weeks from the list.
            <div className="dragDrop">select a week</div>
            <hr />
            2. Select another owner's week to trade for..
            <div className="dragDrop">select a week</div>
            <hr />
            3. Even the trade (estimated value provided).
            <Input type="text" className="text-center mt-2" defaultValue="$500.00" />
            <hr />
            <Button block color="success">Propose Trade</Button>
          </div>
        ) : (
          <div>Trade weeks with other owners.</div>
        )}
      </Col>
    </Row>
  );
}

export default MarketplaceView;
