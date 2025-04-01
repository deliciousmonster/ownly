import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Row } from 'reactstrap';

import config from '../config.js';

function PropertiesView() {
  const [properties, setProperties] = useState([]);

  const getProperties = async () => {
    const response = await axios.get(`${config.API_URL}/properties/`);
    if (response?.data) {
      setProperties(response.data);
    }
  }

  useEffect(() => {
    getProperties();
  }, [])

  return (
    <Row id="properties" className="mb-5">
      {properties?.map((property) =>  (
        <Col md="6" xl="4" xs="12" key={property.id}>
          <div className="card" style={{ backgroundImage: `url(/properties/${property.image})` }}>
            <div className="darker">
              <Row className="w-100">
                <Col>
                  <h4>{property.name}</h4>
                  {property.price} 1/{property.totalShares} Share<br />
                  {property.address}
                </Col>
                <Col className="button">
                  <Button size="sm" block color="success">inquire</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default PropertiesView;
