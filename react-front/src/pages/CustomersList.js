import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CustomersListAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'

export const CustomersList = () => {
  const [customers, setCustomers] = useState({loading: true, data: []});
  const history = useHistory();
  useEffect(()=>{
    if ((customers.data.length === 0) && customers.loading){
      (async () => {
        try{
          let r = await CustomersListAPI();
          setCustomers({loading: false, data: r.data});
        } catch(err){
          // TODO: errror page
          console.log(err);
        }
      })();
    }
  }, [customers])

  if (customers.loading){
    return (
      <h1>customers are loading!</h1>
    )
  } else {
    const customersTable = customers.data.map(customer => {
      return (
        <tr key={customer.username} className="customer-row" onClick={(e) => {
          history.push(`/customers/${customer.username}/`);
        }}>
          <td>{customer.username}</td>
        </tr>
      )
    });
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xs={10}>
            <Table striped bordered hover variant="dark" className='mt-4'>
              <thead>
                <tr>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {customersTable}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CustomersList;