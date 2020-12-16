import { useEffect, useState } from 'react';
import { RequestDetailAPI, AcceptOfferAPI } from '../api';
import { Link, useHistory } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';


const RequestDetail = (props) => {
  const [requestDetails, setRequestDetails] = useState({});
  const path = props.location.pathname;
  let history = useHistory();
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

  const handleNewOffer = (e) => {
    let el = e.target;
    let possition_id = el.closest('.position').id;
    props.setOfferModal([true, possition_id]);
  }

  const handleNewPosition = async (e) => {
    props.setPositionModal([true, requestDetails.id]);
  }

  const handleAccept = async (e) => {
    let payment_id = e.target.closest('.offer').id;
    let stage = 'Assigned';
    let resolution = "An offer just got accepted!";
    try{
      await AcceptOfferAPI({payment_id, stage, resolution});
    } catch(err){
      console.log(err);
    }
    // to avoid fiddling with chaning the button
    // and blah blah blah
    history.go(0);
  }

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
                  <Card key={position.id} id={position.id} className="position">
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
                              <Card key={ind} id={offer.id} className="offer">
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
                                    {ownerUsername === localStorage.getItem('username') && <Button variant="success" className="ml-3 mb-3" onClick={handleAccept}>Accept</Button>}
                                  </div>
                                </Accordion.Collapse>
                              </Card>
                            )
                          })}
                        </Accordion>
                      {'executors' === localStorage.getItem('role') && <Button variant="success" className="ml-3 my-3" onClick={handleNewOffer}>Make Offer</Button>}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )
              })}
            </Accordion>
            {ownerUsername === localStorage.getItem('username') && <Button variant="success" className="ml-3 mb-3 mt-3" onClick={handleNewPosition}>New Position</Button>}
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