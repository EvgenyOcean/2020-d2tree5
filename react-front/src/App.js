import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RequestDetail from './pages/RequestDetail';

function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login/' component={Login}/>
        <Route exact path='/register/' component={Register}/>
        <Route path='/requests/:username/:request/' render={(props) => <RequestDetail {...props}/>}/>
      </Switch>
    </>
  );
}

export default App;
