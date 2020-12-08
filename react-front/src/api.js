import axios from 'axios';


export const AuthAPI = async (action='logout', data={}) => {
  const instance = axios.create({
    baseURL: 'http://localhost:8000/'
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
    localStorage.removeItem('Authorization');
  }
  return response;
}