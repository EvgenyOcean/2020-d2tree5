import { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RequestsList from './pages/RequestsList';
import RequestDetail from './pages/RequestDetail';
import CustomersList from './pages/CustomersList';
import CustomersDetail from './pages/CustomersDetail';
import ExecutorsList from './pages/ExecutorsList';
import ExecutorDetail from './pages/ExecutorDetail';

import { CreateOfferModal, CreatePositionModal } from './components/Modals';

function App() {
  const [offerModal, setOfferModal] = useState([false, null]);
  const [positionModal, setPositionModal] = useState([false, null]);
  

  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login/' component={Login}/>
        <Route exact path='/register/' component={Register}/>
        <Route exact path='/customers/:username/' component={CustomersDetail} />
        <Route exact path='/customers/' component={CustomersList} />
        <Route exact path='/executors/' component={ExecutorsList} />
        <Route exact path='/executors/:username/' component={ExecutorDetail} />
        <Route path='/requests/:username/:request/' render={(props) => <RequestDetail {...props} setOfferModal={setOfferModal} setPositionModal={setPositionModal}/>}/>
        <Route exact path='/requests/'>
          <RequestsList setOfferModal={setOfferModal} />
        </Route>
      </Switch>
      <CreateOfferModal
        show={offerModal[0]}
        onHide={() => setOfferModal([false, null])}
        id={offerModal[1]}
      />

      <CreatePositionModal
        show={positionModal[0]}
        onHide={() => setPositionModal([false, null])}
        id={positionModal[1]}
      />
    </>
  );
}

export default App;
