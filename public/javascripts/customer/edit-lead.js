import { handleMessage } from '../helpers.js';

document.querySelector('.edit-lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);
    console.log(formData, '====>>>>lead')

    const url = window.location.href;
    const parts = url.split("/");
    const number = parts[parts.length - 1];

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/edit-lead/${number}`, formData);
    handleMessage('success', 'Success', response.data.message);
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

const locationPin = document.getElementById('location-pin')

locationPin.addEventListener('blur', async (event) => {
  const pincode = event.target.value;
  try {
    const response = await axios.get(`/get-city-via-pincode/${pincode}`);
    if (response.data.data.name) {
      document.querySelector(`#pin-state`).value =
        response.data.data?.name;
      document.querySelector(`#pin-city`).value =
        response.data.data?.state;
    }
  } catch (error) { }
})