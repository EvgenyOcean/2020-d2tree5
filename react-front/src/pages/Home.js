import { useEffect, useState } from "react";
import { HomeAPI } from '../api';
import { getStorageData } from '../utils';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link, useHistory } from 'react-router-dom';

export const Home = () => {
  const [storageData] = useState(getStorageData());
  const [requests, setRequests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory()
  useEffect(()=>{
    let {username, token, role} = storageData;
    if ([username, token, role].every(Boolean)){
      (async () => {
        try{
          let r = await HomeAPI();
          if (r !== 'admin'){
            let requests = r.data['requests'];
            if (requests){
              // getting request name from absolute url
              requests = requests.map(requestUrl => {
                let startName = requestUrl.slice(0, requestUrl.length - 1).lastIndexOf('/');
                let requestName = requestUrl.slice(startName + 1, requestUrl.length - 1);
                return [requestName, requestUrl];
              })
              setRequests(requests);
            }
          } 
          setIsAuthenticated(true);
        } catch(err){
          // TODO: redirect to error page
          console.log(err);
        }
      })()
    }
  }, [storageData])

  const handleRedirectToDetail = (e) => {
    let el = e.target;
    history.push(`/requests/${storageData['username']}/${el.id}/`)
  }

  if (isAuthenticated){
    if (storageData['role'] === 'admin'){
      return (
        <Container className="p-4 mt-4">
          <Row className="flex-column align-items-center">
            <Col className="bg-dark text-white py-4 px-4">
              <div className="d-flex flex-column align-items-center">
                <h4>Hello, {storageData['username']}!</h4>
                <p>Here's what we can do today:</p>
              </div>
              <div className="d-flex justify-content-around">
                <Link to='/customers/' className='btn btn-info'>Check out customers</Link>
                <Link to='/executors/' className='btn btn-warning'>Check out exectuors</Link>
                <Link to='/requests/' className='btn btn-danger'>Check out requests</Link>
              </div>
            </Col>
          </Row>
        </Container>
      )
    } else if (storageData['role'] === 'executors') {
      return (
        <Container className="p-4 mt-4">
          <Row className="flex-column align-items-center">
            <Col className="bg-dark text-white py-4 px-4">
              <div className="d-flex flex-column align-items-center">
                <h4>Hello, {storageData['username']}!</h4>
                <p>My brave, executor!</p>
                <p>Here's what we can do today:</p>
              </div>
              <div className="d-flex justify-content-around">
                <Link to='/customers/' className='btn btn-info'>Check out customers</Link>
                <Link to='/requests/' className='btn btn-danger'>Check out requests</Link>
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
              <div className="d-flex flex-column align-items-center">
                <h4>Hello, {storageData['username']}!</h4>
                <p>Our dear, customer!</p>
                <p>Here's what we can do today:</p>
              </div>
              <div className="d-flex justify-content-around">
                <Link to='/customers/' className='btn btn-info'>Create Request</Link>
              </div>
            </Col>
          </Row>
          <Row className="flex-column align-items-center mt-4">
            <Col className="bg-dark py-4 px-4">
              <div className="d-flex flex-column align-items-center">
                <h3 className="text-white">Here's your current requests:</h3>
                <ul className="list-group list-group-flush">
                  {requests.map(request => <li className="requests list-group-item bg-info text-white mb-2" key={request[0]} id={request[0]} onClick={handleRedirectToDetail}>{decodeURI(request[0]).replaceAll('-', ' ')}</li>)}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      )
    }
  } else {
    return (
      <h3>You're not authenticated!</h3>
    )
  }
}

export default Home;