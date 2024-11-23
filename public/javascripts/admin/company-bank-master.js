import { handleMessage } from '../helpers.js';
let companyBankMasterId = '';
const excelBtn = document.querySelector('.excel-btn');

$(document).on('select2:open', () => {
  document.querySelector('.select2-search__field').focus();
});

$(document).ready(function () {
  $('.bank-select-box').select2({
    placeholder: 'Search for bank',
    width: '100%',
    dropdownCssClass: 'max-z-index',
    dropdownParent: $('#createCompanyBankMasterModal'),
  });
  $('.edit-bank-select-box').select2({
    placeholder: 'Search for company',
    width: '100%',
    dropdownCssClass: 'max-z-index',
    dropdownParent: $('#editCompanyBankMasterModal'),
  });
});

document
  .querySelector('.create-company-bank-master-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('/admin/setup/company-bank-master', formData);
      const { status, message } = response.data;
      handleMessage('success', 'Success!', 'Other bank master created successfully!');
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

document
  .querySelector('.edit-company-bank-master-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.patch(
        `/admin/setup/company-bank-master/update/${companyBankMasterId}`,
        formData
      );
      const { status, message } = response.data;

      handleMessage('success', 'Success!', 'Other bank master updated successfully!');
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

document.querySelectorAll('.edit-company-bank-master-btn').forEach((btn) => {
  btn.addEventListener('click', async (editBtn) => {
    const companyBankMaster = JSON.parse(editBtn.target.parentElement.dataset.companyBankMaster);
    companyBankMasterId = companyBankMaster.id;
    document.querySelector('.edit-company-master-company-name').value =
      companyBankMaster.companyName;
    $('.edit-bank-select-box').val(companyBankMaster.bankName).trigger('change');
    document.querySelector('.edit-company-master-grade').value = companyBankMaster.grade;
    document.querySelector('.edit-company-master-foir').value = companyBankMaster.foir;
  });
});

document
  .querySelector('.create-company-bank-master-via-excel-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    excelBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp;&nbsp;Loading...`;
    let formData = new FormData(event.target);

    try {
      const response = await axios.post('/admin/setup/company-bank-master-via-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { status, message } = response.data;
      handleMessage('success', 'Success!', 'Other bank master created successfully!');
      event.target.reset();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      excelBtn.innerHTML = `<i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Submit`;
      if (error.hasOwnProperty('response')) {
        return handleMessage('error', 'Something went wrong', error.response.data.message);
      } else {
        return handleMessage('error', 'Something went wrong', error.message);
      }
    }
  });
