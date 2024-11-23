import { handleMessage, checkStringFormat } from '../helpers.js';

const productId = window.location.href.split('/').at(-1);

document
  .querySelector('.two-wheeler-loan-enquiry-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    event.target.classList.toggle('disable-form');
    try {
      let formData = new FormData(event.target);
      formData.set('productId', productId);

      formData = Object.fromEntries(formData.entries());
      const response = await axios.post(`/two-wheeler-loan-enquiry/${productId}`, formData);
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

document.querySelector(`input[name="pancard"]`).addEventListener('input', async (event) => {
  try {
    event.target.value = event.target.value.toUpperCase();
    const panNumber = event.target.value;

    if (panNumber.length < 10) {
      return;
    }

    if (!checkStringFormat(panNumber)) {
      throw new Error('Pancard format is wrong.');
    }

    Swal.fire({
      title: 'Confirm PAN',
      text: `Are you sure your PAN is ${panNumber} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(`/get-pan-details`, { panNumber });
        document.querySelector(`input[name="name"]`).value = response.data.data.name;
      }
    });
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});
