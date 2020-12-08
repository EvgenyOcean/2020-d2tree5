import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/login/' component={Login}/>
        <Route exact path='/register/' component={Register}/>
      </Switch>
    </>
  );
}

export default App;
