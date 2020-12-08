import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

import { AuthAPI } from '../api';
import { useLocation, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Header = () => {
  let location = useLocation();
  let history = useHistory();
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem('Authorization');
    if (token){
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [location])

  const handleLogout = async () => {
    try{
      await AuthAPI();
    } catch(err){
      console.log(err);
    } finally{
      return history.push('/login')
    }
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Link to="/" className="navbar-brand">d2tree5</Link>
      <Nav className="ml-auto">
        {isLoggedIn ? 
          <Nav.Link to="/logout" onClick={handleLogout}>Logout</Nav.Link> :
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Sign up</Link>
          </>
        }
      </Nav>
    </Navbar>
  )
}

export default Header;