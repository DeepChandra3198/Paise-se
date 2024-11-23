import { handleMessage } from '../helpers.js';
let breId = '';
let cityUploadRoute = '';

$(document).on('select2:open', () => {
  document.querySelector('.select2-search__field').focus();
});

$(document).ready(function () {
  $('.bank-select-box').select2({
    placeholder: 'Search for bank',
    width: '100%',
    dropdownCssClass: 'max-z-index',
    dropdownParent: $('#createPersonalLoanBreModal'),
  });
  $('.edit-bank-select-box').select2({
    placeholder: 'Search for company',
    width: '100%',
    dropdownCssClass: 'max-z-index',
    dropdownParent: $('#editPersonalLoanBreModal'),
  });
});

document
  .querySelector('.create-personal-loan-bre-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);

    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('/admin/setup/personal-loan-bre', formData);
      const { status, message } = response.data;
      handleMessage('success', 'Success!', 'Personal loan bre created successfully!');
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

document.querySelector('.edit-personal-loan-bre-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  // this is the formData object with the form data key value pairs
  formData = Object.fromEntries(formData.entries());

  try {
    const response = await axios.patch(`/admin/setup/personal-loan-bre/update/${breId}`, formData);
    const { status, message } = response.data;

    handleMessage('success', 'Success!', 'Personal loan bre updated successfully!');
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

document.querySelectorAll('.edit-personal-loan-bre-btn').forEach((btn) => {
  btn.addEventListener('click', async (editBtn) => {
    const bre = JSON.parse(editBtn.target.parentElement.dataset.bre);
    breId = bre.id;
    document.querySelector('.bre-product-id').value = bre.productId;
    document.querySelector('.bre-age').value = bre.age;
    document.querySelector('.bre-max-age').value = bre.maxAge;
    document.querySelector('.bre-income').value = bre.income;
    document.querySelector('.bre-max-loan-amount').value = bre.maxLoanAmount;
    document.querySelector('.bre-other-income').value = bre.otherIncome;
    document.querySelector('.redirect-url').value = bre.redirectUrl;
    $('.edit-bank-select-box').val(bre.bankName).trigger('change');
  });
});

document.querySelectorAll('.add-city-btn').forEach((btns) => {
  btns.addEventListener('click', (btn) => {
    cityUploadRoute = btn.target.dataset.url;
    console.log(btn.target, cityUploadRoute);
  });
});

document.querySelector('.create-cities').addEventListener('submit', async (event) => {
  event.preventDefault();
  let formData = new FormData(event.target);
  try {
    const response = await axios.post(cityUploadRoute, formData, {
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
document.querySelectorAll('.view-cities').forEach((btns) => {
  btns.addEventListener('click', async (btn) => {
    const id = +btn.target.dataset.id;

    try {
      const response = await axios.get(`/admin/setup/personal-loan-cities/${id}`);
      document.querySelector('.cities').innerHTML = response.data.data
        .map((city, index) => {
          return `
        <tr>
          <td>
            <p class="text-muted mb-0">${index}</p>
          </td>
          <td>
            <p class="text-muted mb-0">${city.city}</p>
          </td>
          <td>
            <p class="text-muted mb-0">${city.pincode}</p>
          </td>
        </tr>
        `;
        })
        .join(' ');
    } catch (error) {}
  });
});
