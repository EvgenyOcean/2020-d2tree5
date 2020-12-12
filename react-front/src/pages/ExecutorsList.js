import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ExecutorsListAPI } from '../api';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'

export const ExecutorsList = () => {
  const [executors, setExecutors] = useState({loading: true, data: []});
  const history = useHistory();
  useEffect(()=>{
    if ((executors.data.length === 0) && executors.loading){
      (async () => {
        try{
          let r = await ExecutorsListAPI();
          setExecutors({loading: false, data: r.data});
        } catch(err){
          // TODO: errror page
          console.log(err);
        }
      })();
    }
  }, [executors])

  if (executors.loading){
    return (
      <h1>executors are loading!</h1>
    )
  } else {
    const executorsTable = executors.data.map(executor => {
      return (
        <tr key={executor.username} className="executor-row" onClick={(e) => {
          history.push(`/executors/${executor.username}/`);
        }}>
          <td>{executor.username}</td>
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
                {executorsTable}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }

}

export default ExecutorsList;