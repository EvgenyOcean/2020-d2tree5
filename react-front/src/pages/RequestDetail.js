import { useEffect, useState } from 'react';
import { RequestDetailAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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
    return (
      <Container className="p-4 mt-4">
        <Row className="flex-column align-items-center">
          <Col className="bg-dark text-white py-4 px-4">
            Hello From {requestDetails['request_name']}!
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