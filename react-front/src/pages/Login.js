import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {useHistory} from 'react-router-dom';
import handleFormSubmit from '../utils';

export const Login = () => {
  let history = useHistory();
  return (
    <Container className="p-4 mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="bg-dark text-white py-4 px-4 rounded">
          <Form onSubmit={(e)=>{
            handleFormSubmit.call(null, 'login', e).then(result => {
              if (result === 'success'){
                history.push('/');
              }
            })
          }}>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" required />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" 
                            required minLength="8" name="password" />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;