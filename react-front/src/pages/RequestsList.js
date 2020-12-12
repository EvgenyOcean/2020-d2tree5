import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { RequestsListAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

export const RequestsList = () => {
  const [requests, setRequests] = useState({loading: true, data: []});
  const location = useLocation();
  useEffect(()=>{
    if ((requests.data.length === 0) && requests.loading){
      (async () => {
        try{
          let r = await RequestsListAPI(location.search);
          setRequests({loading: false, data: r.data});
        } catch(err){
          // TODO: errror page
          console.log(err);
        }
      })();
    }
  }, [requests, location.search])

  if (requests.loading){
    return (
      <h1>Requests are loading!</h1>
    )
  } else {
    let beutified_requests = requests.data.map(request => {
      let ownerUrl = request.owner;
      let startName = ownerUrl.slice(0, ownerUrl.length - 1).lastIndexOf('/');
      let ownerUsername = ownerUrl.slice(startName + 1, ownerUrl.length - 1);
      return <div key={request.request_name} className="requests-list">
        <h3>{request.request_name}</h3>
        <p>owner: <Link to={'/customers/' + ownerUsername + '/'} push="true">{ownerUsername}</Link></p>
        <hr/>
        <h5>Positions</h5>
        <Accordion>
          {request.positions.map(position => {
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
      </div>
    })
    return (
      <Container>
        <Row className="justify-content-center my-4">
          <Col xs={10}>
            {beutified_requests}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default RequestsList;