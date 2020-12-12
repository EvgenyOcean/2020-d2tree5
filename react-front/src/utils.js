import { AuthAPI } from './api';


export const handleFormSubmit = async (action, e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  let result;
  try{
    if (action === 'login'){
      let response = await AuthAPI('login', data);
      const {token, username, role} = response.data;
      localStorage.setItem('Authorization', 'Token ' + token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
    } else if (action === 'register'){
      await AuthAPI('register', data);
    }
    result = 'success'
  } catch (err){
    if (err.response.status === 400 || err.response.status === 401){
      if (action === 'login'){
        document.querySelectorAll('.login-error').forEach(el => {el.remove()});
        let containerDiv = document.forms[0].parentElement;
        let div = document.createElement('div');
        div.classList.add('alert-danger', 'alert', 'my-3', 'login-error');
        div.textContent = err.response.data['non_field_errors'];
        containerDiv.prepend(div);
      } else {
        const errData = err.response.data;
        document.querySelectorAll('input').forEach(el => {el.style.border = '2px solid green'});
        document.querySelectorAll('small').forEach(small => small.remove());
        if (errData['non_field_errors']){
          let small = document.createElement('small');
          small.style.color = 'red';
          small.textContent = errData['non_field_errors'];
          document.forms[0].insertAdjacentElement('afterbegin', small);
        } else {
          Object.getOwnPropertyNames(errData).forEach(errFieldName => {
            let formFieldEl = document.forms[0].querySelector(`[name=${errFieldName}]`);
            formFieldEl.style.border = "1px solid red";
            let small = document.createElement('small');
            small.style.color = 'red';
            small.textContent = errData[errFieldName][0];
            formFieldEl.after(small);
          })
        }
      }
    }
    result = 'error';
  } finally {
    return result;
  }
}

export const getStorageData = () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('Authorization');
  const role = localStorage.getItem('role');

  return {username, token, role}
}

export default handleFormSubmit;