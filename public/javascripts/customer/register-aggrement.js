import { handleMessage } from '../helpers.js';

document.querySelector('.register-aggrement-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    // let formData = new FormData(event.target);
    
    const url = window.location.href;
    const parts = url.split("/");
    const number = parts[parts.length - 1];

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/register-aggrement/${number}`);
    handleMessage('success', 'Success', 'Registration Successful');
    setTimeout(() => {
      window.location.href = `/set-password/${number}`
    }, 3000)
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});