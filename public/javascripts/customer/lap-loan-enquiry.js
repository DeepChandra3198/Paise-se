import { handleMessage } from '../helpers.js';

const productId = window.location.href.split('/').at(-1);

document.querySelector('.home-loan-enquiry-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  event.target.classList.toggle('disable-form');
  try {
    let formData = new FormData(event.target);
    formData.set('productId', productId);

    formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/lap-loan-enquiry/${productId}`, formData);
    Swal.fire({
      title: 'Congratulations !!',
      text: response.data.message,
      imageUrl: `/images/success-icon.png`,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = '/';
      }
    });
  } catch (error) {
    event.target.classList.toggle('disable-form');
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});
