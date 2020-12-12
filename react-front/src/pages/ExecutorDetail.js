import { useEffect, useState } from 'react';
import { ExecutorDetailAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const ExecutorDetail = (props) => {
  const [executorDetail, setExecutorDetail] = useState([]);
  const path = props.location.pathname;
  useEffect(()=>{
    if (executorDetail.length === 0){
      (async () => {
        try{
          let r = await ExecutorDetailAPI(path);
          setExecutorDetail(r.data);
        } catch(err){
          // TODO: Error page
          console.log(err);
        }
      })()
    }
  }, [executorDetail, path])

  if (executorDetail['user']){
    return (
      <Container className="p-4 mt-4">
        <Row className="d-flex justify-content-between">
          <Col xs={4} className="bg-dark text-white py-4 px-4">
            <h3>Offers</h3>
            <hr/>
            {executorDetail['offers'].map((offer, ind) => {
              return <div key={ind}>
                <h5>Request: {offer.request_name}</h5>
                <ul>
                  <li>Position: {offer.position_name}</li>
                  <li>GMP: {offer.gmp}</li>
                  <li>Date: {offer.date_created}</li>
                  <li>Accepted: <span className={offer.is_accepted ? 'text-success' : 'text-danger'}>{offer.is_accepted ? "YES" : "NO"}</span></li>
                </ul>
              </div>
            })}
          </Col>

          <Col xs={7} className="bg-dark text-white py-4 px-4">
            <h3>{executorDetail['user']['username']}</h3>
            <hr/>
            <div>
              <h5>Fist Name</h5>
              <p>{executorDetail['user']['first_name']}</p>
              <h5>About</h5>
              <p>{executorDetail['user']['about']}</p>
            </div>
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


export default ExecutorDetail;