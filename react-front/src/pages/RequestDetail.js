import { useEffect, useState } from 'react';
import { RequestDetailAPI } from '../api';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';


const RequestDetail = (props) => {
  const [requestDetails, setRequestDetails] = useState({});
  const path = props.location.pathname;
  useEffect(()=>{
    if (Object.getOwnPropertyNames(requestDetails).length === 0){
      (async () => {
        try{
          let r = await RequestDetailAPI(path);
          setRequestDetails(r.data);
        } catch(err){
          // TODO: Error page
          console.log(err);
        }
      })()
    }
  }, [requestDetails, path])

  if (requestDetails['request_name']){
    let requestName = requestDetails['request_name'];
    let positions = requestDetails['positions'];
    let ownerUrl = requestDetails['owner'];
    let startName = ownerUrl.slice(0, ownerUrl.length - 1).lastIndexOf('/');
    let ownerUsername = ownerUrl.slice(startName + 1, ownerUrl.length - 1);
    return (
      <Container className="p-4 mt-4">
        <Row className="flex-column align-items-center">
          <Col className="bg-dark text-white py-4 px-4">
            <h3>{requestName}</h3>
            <p>owner: <Link to={'/customers/' + ownerUsername + '/'} push="true">{ownerUsername}</Link></p>
            <hr/>
            <h5>Positions</h5>
            <Accordion className="requests-list">
              {positions.map(position => {
                return (
                  <Card key={position.id}>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey={position.id} className="text-white">
                        {position.name}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={position.id}>
                      <Card.Body>
                        <ul>
                          <li>Stage: {position.stage}</li>
                          <li>Amount: {position.amount}</li>
                        </ul>
                        <h5>Offers:</h5>
                        <hr/>
                        <Accordion defaultActiveKey="0">
                          {position.payment.map((offer, ind) => {
                            return (
                              <Card key={ind}>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey={ind + 1}>
                                    Offered by: {offer.executor}
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={ind + 1}>
                                  <div>
                                    <ul>
                                      <li>GMP: {offer.gmp}</li>
                                      <li>Accepted: <span className={offer.is_accepted ? 'text-success' : 'text-danger'}>{offer.is_accepted ? "YES" : "NO"}</span></li>
                                    </ul>
                                    {ownerUsername === localStorage.getItem('username') && <Button variant="success" className="ml-3 mb-3">Accept!</Button>}
                                  </div>
                                </Accordion.Collapse>
                              </Card>
                            )
                          })}
                        </Accordion>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )
              })}
            </Accordion>
          </Col>
        </Row>
      </Container>
    )
  } else {
    return (
      <Container className="p-4 mt-4">
        <Row className="flex-column align-items-center">
          <Col className="bg-dark text-white py-4 px-4">
            Data is loading!
          </Col>
        </Row>
      </Container>
    )
  }
}

export default RequestDetail;