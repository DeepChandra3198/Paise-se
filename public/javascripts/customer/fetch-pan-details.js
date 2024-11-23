import { handleMessage, checkStringFormat } from '../helpers.js';

document.querySelector('.pan-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData.entries());

    if (!checkStringFormat(formData.panNumber)) {
      throw new Error('Pancard format is wrong.');
    }
    Swal.fire({
      title: 'Confirm PAN',
      text: `Are you sure your PAN is ${formData.panNumber} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(`/fetch-pan-details`, formData);
        const nameInput = document.querySelector('#name');
        nameInput.classList.remove('d-none');
        nameInput.value = response.data.data.name;
        document.querySelector('.verify-btn').setAttribute('disabled', true);
        document.querySelector('.verify-btn').textContent = 'Your PAN details has been matched!';
        document.querySelector('.tick-mark').classList.remove('d-none');
        document.querySelector(`input[name="panNumber"]`).classList.add('border-success');
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

document.querySelector(`#panNumber`).addEventListener('input', (event) => {
  event.target.value = event.target.value.toUpperCase();
});
