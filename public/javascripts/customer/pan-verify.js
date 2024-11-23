import { handleMessage } from '../helpers.js';

document.querySelector('.pan-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);

    formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/verify-pan-details`, formData);
    const message = `The given name is ${
      response.data.data.data.pan_data.name_match_status === 'MATCH' ? `'Valid'` : `'Invalid'`
    } and your given date of birth is ${
      response.data.data.data.pan_data.dob_match_status === 'MATCH' ? `'Valid'` : `'Invalid'`
    }`;

    Swal.fire({
      title: response.data.data.data.message,
      text: message,
      imageUrl: `/images/success-icon.png`,
      allowOutsideClick: false,
    });
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});
