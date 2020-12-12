import {useHistory} from 'react-router-dom';

import { useEffect, useState } from 'react';
import { CustomerDetailAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const CustomerDetail = (props) => {
  const [customerDetail, setCustomerDetail] = useState([]);
  const path = props.location.pathname;
  const history = useHistory();
  useEffect(()=>{
    if (customerDetail.length === 0){
      (async () => {
        try{
          let r = await CustomerDetailAPI(path);
          let requests = r.data.requests.map(requestUrl => {
            let startName = requestUrl.slice(0, requestUrl.length - 1).lastIndexOf('/');
            let requestName = requestUrl.slice(startName + 1, requestUrl.length - 1);
            return requestName;
          })
          r.data.requests = requests;
          setCustomerDetail(r.data);
        } catch(err){
          // TODO: Error page
          console.log(err);
        }
      })()
    }
  }, [customerDetail, path])

  const handleRedirectToDetailRequest = (e) => {
    let request_slug = e.target.id;
    let username = customerDetail.user.username;
    history.push(`/requests/${username}/${request_slug}/`);
  }

  if (customerDetail['user']){
    return (
      <Container className="p-4 mt-4">
        <Row className="d-flex justify-content-between">
          <Col xs={4} className="bg-dark text-white py-4 px-4">
            <h4>Requests</h4>
            {customerDetail['requests'].map(request => <li key={request} id={request} onClick={handleRedirectToDetailRequest} className="single-request">{decodeURI(request).replaceAll('-', ' ')}</li>)}
          </Col>

          <Col xs={7} className="bg-dark text-white py-4 px-4">
            <h3>{customerDetail['user']['username']}</h3>
            <hr/>
            <div>
              <h5>Fist Name</h5>
              <p>{customerDetail['user']['first_name']}</p>
              <h5>About</h5>
              <p>{customerDetail['user']['about']}</p>
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

export default CustomerDetail;