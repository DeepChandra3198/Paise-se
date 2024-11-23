import { handleMessage } from '../helpers.js';

document.querySelector('.profile-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post('/customer/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    handleMessage('success', 'Success', response.data.message);
    setTimeout(() => {
      window.location.href = '/customer/dashboard'
    }, 2000)
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelector('.loan-type').addEventListener('change', async (event) => {
  location.href = `/customer/dashboard?type=${event.target.value}`;
});
