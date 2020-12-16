import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { CreateOfferAPI, CreatePositionAPI, CreateRequestAPI } from '../api';

export function CreateOfferModal(props) {
  const handleCreate = async () => {
    let input = document.getElementById('gmp');
    let position_id = props.id;
    let gmp = input.value;
    try{
      await CreateOfferAPI({position_id, gmp});
    } catch(err){
      // TODO: display error page
      console.log(err.response.data);
    }

    // not the best decision, but will do for now
    window.location.reload();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Offer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="number" id="gmp" />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={handleCreate}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}


export function CreatePositionModal(props) {
  const handleCreate = async () => {
    let name = document.getElementsByName('name')[0].value;
    let okpd2 = document.getElementsByName('okpd2')[0].value;
    let okei = document.getElementsByName('okei')[0].value;
    let amount = document.getElementsByName('amount')[0].value;
    let request_id = props.id;
    try{
      await CreatePositionAPI({request_id, name, okpd2, okei, amount});
    } catch(err){
      // TODO: display error page
      console.log(err.response.data);
    }

    // not the best decision, but will do for now
    window.location.reload();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Position
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Name
          <input type="text" name="name" />
        </label>
        <label>okpd2
          <input type="text" name="okpd2" />
        </label>
        <label>okei
          <input type="number" name="okei" />
        </label>
        <label>amount
          <input type="number" name="amount" />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={handleCreate}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}


export function CreateRequestModal(props) {
  const handleCreate = async () => {
    let request_name = document.getElementsByName('name')[0].value;
    let deadline = document.getElementsByName('deadline')[0].value;
    try{
      let r = await CreateRequestAPI({request_name, deadline});
      console.log(r.data);
    } catch(err){
      // TODO: display error page
      console.log(err.response.data);
    }

    // not the best decision, but will do for now
    // window.location.reload();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Position
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>Name
          <input type="text" name="name" />
        </label>
        <label>Deadline
          <input type="date" name="deadline" />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={handleCreate}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}