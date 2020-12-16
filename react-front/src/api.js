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


export const CustomerDetailAPI = async (url) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get(url);
}


export const CustomersListAPI = async () => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get('/customers/');
}


export const ExecutorDetailAPI = async (url) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get(url);
}


export const ExecutorsListAPI = async () => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get('/executors/');
}


export const RequestsListAPI = async (search='') => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.get('/requests/' + search);
}


export const CreateOfferAPI = async (data) => {
  console.log("HERE!!!");
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.post('/add-offer/', data);
}


export const CreatePositionAPI = async (data) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.post('/add-position/', data);
}


export const AcceptOfferAPI = async (data) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.put('/update-offer/', data);
}


export const CreateRequestAPI = async (data) => {
  let token = localStorage.getItem('Authorization');
  const instance = axios.create({
    baseURL: HOME_URL,
    headers: {
      'Authorization': token,
    }
  })
  return await instance.post('/create-request/', data);
}