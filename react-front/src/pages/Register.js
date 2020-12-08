import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import handleFormSubmit from '../utils';
import { useHistory } from 'react-router-dom';

export const Register = () => {
  const history = useHistory();
  return (
    <Container className="p-4 mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="bg-dark text-white py-4 px-4 rounded">
          <Form onSubmit={(e) => {
            handleFormSubmit.call(null, 'register', e).then(result => {
              if (result === 'success'){
                history.push('/login');
              }
            })
          }}>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" name="email" placeholder="Enter email" required />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username"
                            required maxLength="32" name="username"/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" 
                            required minLength="8" name="password" />
            </Form.Group>

            <Form.Group controlId="executorCheck">
              <Form.Check type="radio" name="is_executor" label="Executor" />
            </Form.Group>
            <Form.Group controlId="customerCheck">
              <Form.Check type="radio" name="is_customer" label="Customer" />
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Register;