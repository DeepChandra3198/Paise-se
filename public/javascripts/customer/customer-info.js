import { handleMessage, convertNumberToCommaSeparated, allowOnlyNumber, checkStringFormat } from '../helpers.js';

const productId = window.location.href.split('/').at(-1);
let formId = null;

document.querySelectorAll('.employment-Type').forEach((empType) => {
  empType.addEventListener('change', (type) => {
    const employentType = type.target.value;
    const headingTag = document.querySelector('.income-type-heading');
    switch (employentType) {
      case 'Salaried':
        headingTag.textContent = 'Net Monthly Income';
        break;
      case 'Self Employed':
        headingTag.textContent = 'Net Monthly Business Income';
        break;
      case 'Self-Employed Professional':
        headingTag.textContent = 'Net Monthly Recipt';
        break;
    }
  });
});

$('.wrapper').on('change', 'select', function () {
  const value = $('.credit-card-holder').val();
  document.querySelectorAll('.card-holder-div').forEach((div) => {
    if (value === '1') {
      div.classList.remove('d-none');
    } else {
      div.classList.add('d-none');
    }
  });
});

document.querySelector(`input[name="pincode"]`).addEventListener('input', async (event) => {
  const pincode = event.target.value;
  try {
    const response = await axios.get(`/get-city-via-pincode/${pincode}`);
    if (response.data.data.name) {
      document.querySelector(`input[name="city"]`).value = response.data.data?.name;
      document.querySelector(`input[name="state"]`).value = response.data.data?.state;
    }
  } catch (error) {}
});

document.querySelector('.step-1-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);
    formData.set('productId', productId);

    if (formId !== null) {
      formData.set('id', formId);
    }

    formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/customer-info-step-one/${productId}`, formData);
    handleMessage('success', 'Success', response.data.message);
    formId = response.data.data.id;
    document.querySelector('.personal-loan_wrap2').classList.add('open');
    document.querySelector('.personal-loan_wrap1').classList.add('close');
    document.querySelector('.personal-loan_wrap1').classList.remove('open');
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelector('.step-2-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);
    formData.set('id', formId);
    const creditCardProvidedBy = Array.from(
      document.querySelector('.credit-card-provided-by').selectedOptions
    ).map(({ value }) => value);
    formData.set('creditCardProvidedBy', JSON.stringify(creditCardProvidedBy));
    formData = Object.fromEntries(formData.entries());

    const response = await axios.post(`/customer-info-step-two`, formData);
    handleMessage('success', 'Success', response.data.message);
    location.href = `/cards?info=${formId}`;
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelector('.annual-income').addEventListener('paste', (event) => {
  event.preventDefault();
});

document.querySelector('.annual-income').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="annualIncome"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
});

document.querySelector('.tentative-credit-limit').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="tentativeCreditLimit"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
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
