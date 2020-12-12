import axios from 'axios';
import {HOME_URL, AUTH_URL} from './urls';


export const AuthAPI = async (action='logout', data={}) => {
  const instance = axios.create({
    baseURL: AUTH_URL
  })
  let response;
  if (action === 'login'){
    response = await instance.post('/login/', data);
  } else if (action === 'register'){
    response = await instance.post('/register/', data);
  } else {
    const token = localStorage.getItem('Authorization');
    instance.defaults.headers.common['Authorization'] = token;
    response = await instance.post('/logout/');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('Authorization');
  }
  return response;
}


export const HomeAPI = async () => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  let role = localStorage.getItem('role');
  if (role === 'admin'){
    return 'admin';
  } else {
    let username = localStorage.getItem('username');
    if (role && username){
      return await instance.get(`${role}/${username}/`);
    }
  }
  // TODO: display an error
}

export const RequestDetailAPI = async (url) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get(url);
}