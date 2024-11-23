import { handleMessage } from '../helpers.js';


// Function to show the loader
function showLoader() {
  const loader = document.getElementById('screen-loader');
  loader.classList.remove('d-none');
}

// Function to hide the loader
function hideLoader() {
  const loader = document.getElementById('screen-loader');
  loader.classList.add('d-none');
}

document.querySelector('.register-account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  showLoader()
  try {
    let formData = new FormData(event.target);

    const url = window.location.href;
    const parts = url.split("/");
    const number = parts[parts.length - 1];
    console.log(formData.bankChequeDocument)
    if (!formData.bankChequeDocument) {
      handleMessage('success', 'Bank Cheque Required');
    }

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/register-account/${number}`, formData);
    handleMessage('success', 'Success', response.data.message);
    setTimeout(() => {
      window.location.href = '/register-aggrement/' + number
    }, 2000)
    hideLoader()
  } catch (error) {
    hideLoader()
    console.log(error)
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});


const bankIfscInput = document.getElementById('bankIfsc')
bankIfscInput.addEventListener('blur', async () => {
  try {
    showLoader()
    const response = await axios.get(`/get-bank-via-ifsc/${bankIfscInput.value}`);
    if (response.data.data.bank) {
      document.querySelector(`input[name="bankName"]`).value =
        response.data.data?.bank;
      document.querySelector(`input[name="bankName"]`).readOnly = true
      document.querySelector(`input[name="bankBranch"]`).value =
        response.data.data?.branch;
      document.querySelector(`input[name="bankBranch"]`).readOnly = true
    }
    hideLoader()

  } catch (error) {
    hideLoader()
  }
})


const bankIfscInputAgain = document.getElementById('bankIfsc');
const AccountInputAgain = document.getElementById('bankAccount');
const selectedUserTypeAgain = document.querySelector('input[name="accountVerifyType"]:checked')?.id;

if (selectedUserTypeAgain !== "cheque") {
  AccountInputAgain.addEventListener('blur', async () => {
    const accountNumber = AccountInputAgain.value.trim();
    const ifsc = bankIfscInputAgain.value.trim();

    if (!accountNumber || !ifsc) {
      handleMessage('error', 'Please enter both account number and IFSC.');
      return;
    }

    try {
      showLoader(); // Show loader while API request is in progress

      const response = await axios.post(`/verifyAccountNo`, { accountNumber, ifsc });

      if (response.data?.data?.beneficiary_name) {
        document.querySelector(`input[name="bankAccountHolder"]`).value = response.data.data.beneficiary_name;
        document.querySelector('.registerSubmitButton').classList.remove('d-none'); // Show submit button
      } else {
        handleMessage('error', 'Account verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying account number:', error);
      handleMessage('error', 'There was an error verifying the account number. Please try again.');
    } finally {
      hideLoader(); // Ensure loader is hidden in all cases
    }
  });
}



const chequeUploadInput = document.getElementById('number');
const selectedBankChequeLabel = document.getElementById('selectedBankCheque');

chequeUploadInput.addEventListener('change', async (event) => {
  try {
    showLoader()
    const file = event.target.files[0];
    if (!file) {
      selectedBankChequeLabel.textContent = 'Please select a file!';
      return;
    }

    selectedBankChequeLabel.innerHTML = `<b>Selected: ${file.name}</b>`;

    const formData = new FormData();
    formData.append('bankChequeDocument', file);

    const response = await axios.post('/verifyCheque', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.status === 'success') {
      document.querySelector(`input[name="bankName"]`).value =
        response.data.data.data?.bank_name;
      document.querySelector(`input[name="bankIfsc"]`).value =
        response.data.data.data?.bank_ifsc_code;
      document.querySelector(`input[name="bankBranch"]`).value =
        response.data.data.data?.branch_name;
      document.querySelector(`input[name="bankAccount"]`).value =
        response.data.data.data?.bank_account_number;
      document.querySelector('.bankIfsc').classList.remove('d-none');
      document.querySelector('.bankName').classList.remove('d-none');
      document.querySelector('.bankBranch').classList.remove('d-none');
      document.querySelector('.bankAccount').classList.remove('d-none');
      document.querySelector('.bankAccountHolder').classList.remove('d-none');
      document.querySelector('.bankChequeDocument').classList.remove('d-none');
      // document.querySelector('.registerSubmitButton').classList.remove('d-none');
      handleMessage('success', 'Success', response.data.message);
    } else {
      handleMessage('error', 'error', response.data.message);
    }
    hideLoader()
  } catch (error) {
    hideLoader()
    handleMessage('error', 'error', error.message);
  }
});


const selectedUserType = document.querySelector('input[name="userType"]:checked')?.id;


document.getElementsByName('accountVerifyType').forEach = Array.prototype.forEach;

function updateVisibility() {
  const selectedOption = document.querySelector('input[name="accountVerifyType"]:checked');

  if (selectedOption.id === "cheque") {
    document.querySelector('.bankIfsc').classList.add('d-none');
    document.querySelector('.bankName').classList.add('d-none');
    document.querySelector('.bankBranch').classList.add('d-none');
    document.querySelector('.bankAccount').classList.add('d-none');
    document.querySelector('.bankAccountHolder').classList.add('d-none');
    document.querySelector('.bankChequeDocument').classList.remove('d-none');
  } else {
    document.querySelector('.bankIfsc').classList.remove('d-none');
    document.querySelector('.bankName').classList.remove('d-none');
    document.querySelector('.bankBranch').classList.remove('d-none');
    document.querySelector('.bankAccount').classList.remove('d-none');
    document.querySelector('.bankAccountHolder').classList.remove('d-none');
    document.querySelector('.bankChequeDocument').classList.add('d-none');
  }
}

// Add event listener for change events
document.getElementsByName('accountVerifyType').forEach(function (radioButton) {
  radioButton.addEventListener('change', updateVisibility);
});

// Run the visibility logic on page load
updateVisibility();




const bankIfscInputCheque = document.getElementById('bankIfsc');
const AccountInputCheque = document.getElementById('bankAccount');
const AccountHolderInputCheque = document.getElementById('bankAccountHolder');

AccountHolderInputCheque.addEventListener('click', async () => {
  const selectedUserTypeAgain = document.querySelector('input[name="accountVerifyType"]:checked')?.id;

  if (selectedUserTypeAgain === "cheque") {
    console.log("Selected user type is cheque.");

    const accountNumber = AccountInputCheque.value.trim();
    const ifsc = bankIfscInputCheque.value.trim();

    if (!accountNumber || !ifsc) {
      handleMessage('error', 'Please enter both account number and IFSC.');
      return;
    }

    try {
      showLoader(); // Show loader while API request is in progress

      const response = await axios.post(`/verifyAccountNo`, { accountNumber, ifsc });

      if (response.data?.data?.beneficiary_name) {
        AccountHolderInputCheque.value = response.data.data.beneficiary_name;
        document.querySelector('.registerSubmitButton').classList.remove('d-none'); // Show submit button
      } else {
        handleMessage('error', 'Account verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying account number:', error);
      handleMessage('error', 'There was an error verifying the account number. Please try again.');
    } finally {
      hideLoader(); // Ensure loader is hidden in all cases
    }
  }
});



