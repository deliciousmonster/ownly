import { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import SortableList, { SortableItem } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move';

const saveUser = async (body) => fetch(`https://localhost:9926/Users/${body.name}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

function Admin({ userRecord }) {
  const [weeks, setWeeks] = useState(false);
  const [user, setUser] = useState(userRecord);

  useEffect(() => {
    const getWeeks = async () => {
      const response = await fetch('https://localhost:9926/weeks/');
      const newWeeks = await response.json();
      setWeeks(newWeeks);
    }
    getWeeks();
  }, [])

  useEffect(() => {
    if (weeks && user?.weeks.length === 0) {
      const newUser = { ...user };
      newUser.weeks = weeks;
      setUser(newUser);
    }
  }, [user, weeks])

  const onSortEnd = async (oldIndex, newIndex) => {
    const newUser = { ...user };
    const newUserWeeks = arrayMoveImmutable(newUser.weeks, oldIndex, newIndex);
    newUser.weeks = newUserWeeks;
    setUser(newUser);
    saveUser(newUser);
  }

  return (
    <Row>
      <Col lg={4}>
        <b className="d-block text-white mb-2">1. Prioritize Your Weeks</b>
        <hr className="white" />
        <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged" lockAxis="y">
          {weeks && user?.weeks?.map((week) =>  (
              <SortableItem key={week.weeks}>
                <div className="card mb-1">
                  <div className="card-body text-white">
                    <b>Weeks {week.weeks}</b><br />
                    {week.label}
                  </div>
                </div>
              </SortableItem>
            ))}
        </SortableList>
      </Col>
      <Col lg={4}>
        <b className="d-block text-white mb-2">2. Draft Settings</b>
        <hr className="white" />
        <Card className="mb-1">
          <CardBody className="text-white">
            <b>Split Your 6 Weeks Into 1, 2, or 3 stays</b><br />
            {user?.blocks} Stays
          </CardBody>
        </Card>
        <Card className="mb-1">
          <CardBody className="text-white">
            <b>Your draft priority rotates every year</b><br />
            {user?.priority}
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <b className="d-block text-white mb-2">3. Your Allocated Weeks</b>
        <hr className="white" />
        <Card>
          <CardBody className="text-white">
            We have not yet held the draft. Please check back!
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default Admin;
