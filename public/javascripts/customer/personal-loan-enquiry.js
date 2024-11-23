import {
  handleMessage,
  checkStringFormat,
  convertNumberToCommaSeparated,
  allowOnlyNumber,
} from '../helpers.js';

const companyType = document.querySelector(`input[name="companyType"]`);
const productId = window.location.href.split('/').at(-1);
let formId = null;
let employmentType = 'Salaried';

$(document).on('select2:open', () => {
  document.querySelector('.select2-search__field').focus();
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
    const response = await axios.post(`/personal-loan-step-one/${productId}`, formData);
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
    if (employmentType === 'Salaried') {
      formData.delete('itr');
      formData = Object.fromEntries(formData.entries());
      const response = await axios.post(`/personal-loan-step-two`, formData);
      handleMessage('success', 'Success', response.data.message);
      location.href = `/personal-loan-banks/${formId}`;
    } else {
      formData.delete('salary');
      formData = Object.fromEntries(formData.entries());
      const response = await axios.post(`/personal-loan-step-two-professional`, formData);
      handleMessage('success', 'Success', response.data.message);
      location.href = `/professional-personal-loan-banks/${formId}`;
    }
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

$(document).ready(function () {
  $('.company-select-box').select2({
    ajax: {
      url: '/search-companies',
      dataType: 'json',
      delay: 500,
      data: function (params) {
        let query = {
          companyName: params.term,
        };
        return query;
      },
      processResults: function (data) {
        let companyData = [];
        data.data.forEach((company) => {
          companyData.push({
            id: company.companyName,
            text: company.companyName,
          });
        });
        companyData.push({
          id: 'Other',
          text: 'Other',
        });
        return {
          results: companyData,
        };
      },
      cache: true,
    },
    placeholder: 'Search for company',
    minimumInputLength: 3,
    width: '100%',
  });

  $('.company-select-box').on('select2:select', function (e) {
    const selectedCompany = e.params.data.id;
    if (selectedCompany === 'Other') {
      companyType.value = 'other';
      // $('.company-select-box').select2('destroy');
      $('.company-select-box').prop('disabled', true).trigger('change.select2');
      document.querySelector('.company-select-box-div').insertAdjacentHTML(
        'beforeend',
        `
        <input
          type="text"
          minlength="1"
          maxlength="100"
          name="companyName"
          placeholder="Enter your company name"
          class="form-control mt-3"
        />
      `
      );
      document.querySelector('.company-select-box').remove();
    }
  });
});

document.querySelectorAll('.employment-Type').forEach((checkboxes) => {
  checkboxes.addEventListener('change', (checkbox) => {
    employmentType = checkbox.target.value;
    console.log('sbsb', employmentType);
    if (employmentType === 'Salaried') {
      companyType.value = 'normal';
      document.querySelector(`.salary`).classList.remove('d-none');
      document.querySelector(`.itr`).classList.add('d-none');
      document.querySelector(`input[name="companyName"]`)?.remove();
      document.querySelector('.company-select-box-div').classList.remove('d-none');
      document.querySelector('.type-select-box-div').classList.add('d-none');
    } else {
      companyType.value = 'other';
      document
        .querySelector('.step-2-form')
        .insertAdjacentHTML(
          'afterbegin',
          `<input type="hidden" name="companyName" value="other"/>`
        );
      document.querySelector('.company-select-box-div').classList.add('d-none');
      document.querySelector(`.itr`).classList.remove('d-none');
      document.querySelector(`.salary`).classList.add('d-none');
      document.querySelector('.type-select-box-div').classList.remove('d-none');
    }
  });
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

document.querySelector('.salary').addEventListener('paste', (event) => {
  event.preventDefault();
});

document.querySelector('.salary').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="salary"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
});

document.querySelector('.itr').addEventListener('paste', (event) => {
  event.preventDefault();
});

document.querySelector('.itr').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="itr"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
});

document.querySelector('.loan-amount').addEventListener('paste', (event) => {
  event.preventDefault();
});

document.querySelector('.loan-amount').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="loanAmount"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
});

document.querySelector('.emi-amount').addEventListener('paste', (event) => {
  event.preventDefault();
});

document.querySelector('.emi-amount').addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const numberWithoutComma = +event.target.value.replace(/,/g, '');
  document.querySelector(`input[name="emiAmount"]`).value = numberWithoutComma;
  event.target.value = convertNumberToCommaSeparated(numberWithoutComma);
});
