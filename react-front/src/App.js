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

function App() {
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
        <Route path='/requests/:username/:request/' render={(props) => <RequestDetail {...props}/>}/>
        <Route exact path='/requests/' component={RequestsList} />
      </Switch>
    </>
  );
}

export default App;
