import { handleMessage } from '../helpers.js';


document.querySelector('.update-lead-status').addEventListener('submit', async (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    try {
      const response = await axios.post('update-leads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { status, message } = response.data;
      handleMessage('success', 'Success!', message);
      event.target.reset();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        return handleMessage('error', 'Something went wrong', error.response.data.message);
      } else {
        return handleMessage('error', 'Something went wrong', error.message);
      }
    }
  });