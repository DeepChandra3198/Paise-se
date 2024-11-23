import { handleMessage } from '../helpers.js';


// Function to show the loader
// Function to show the loader
function showLoader() {
  const loader = document.getElementById('screen-loader'); // Corrected ID
  if (loader) {
    loader.style.visibility = "visible"; // Make the loader visible
    loader.classList.remove('d-none'); // Remove d-none class to display the loader
  }
}

// Function to hide the loader
function hideLoader() {
  const loader = document.getElementById('screen-loader'); // Corrected ID
  if (loader) {
    loader.style.visibility = "hidden"; // Hide the loader
    loader.classList.add('d-none'); // Add d-none class to hide the loader completely
  }
}

// Ensure the loader is hidden after the page loads
window.addEventListener('load', () => {
  console.log("Page fully loaded. Hiding loader...");
  hideLoader(); // Hide the loader when the page is fully loaded
});


let otpID = 0;

document.querySelector('.register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
 showLoader()
  try {
    let formData = new FormData(event.target);
    formData.delete('otp')

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/register`, formData);
    handleMessage('success', 'Success', response.data.message);
    setTimeout(() => {
      window.location.href = `/register-account/${response.data.data}`
    }, 2000);
    hideLoader()
  } catch (error) {
    hideLoader()
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelector('.send-otp').addEventListener('click', async (event) => {
  event.preventDefault();
  event.stopPropagation();
 
  function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  try {
    showLoader()
    const phone = document.querySelector(`input[name="phone"]`).value;
    if (!validatePhoneNumber(phone)) {
      hideLoader()
      return handleMessage('error', 'Invalid phone number', 'Phone number must be 10 digits Numeric');
    }
    const response = await axios.post('/register-otp', { phone });
    if (response.data.status === 'error') {
      hideLoader()
      return handleMessage('error', 'Something went wrong', response.data.message);
    }
    handleMessage('success', 'Success', response.data.message);
    otpID = response.data.data.id;
    document.querySelector(`input[name="phone"]`).setAttribute('readonly', true);
    document.querySelector('.send-otp').classList.add('d-none');
    document.querySelector('.send-otp').disabled = true
    document.querySelector('.input-otp-div').classList.remove('d-none');
    hideLoader()
  } catch (error) {
    hideLoader()
    return handleMessage('error', 'Something went wrong', error);
  }
});

document.querySelector('.verify-otp').addEventListener('click', async (event) => {
  event.preventDefault();
  showLoader()
   const otp = document.querySelector(`input[name="otp"]`).value;
  if (otp.length !== 4) {
    return handleMessage('error', 'Something went wrong', 'Login Code must be of 4 digits only');
  }

  try {
    const response = await axios.post(`/register-otp-validate/${otpID}/${otp}`);
    handleMessage('success', 'Success', response.data.message);
    document.querySelector('.input-otp-div').classList.add('d-none');
    document.querySelector('.input-otp-div').disabled = true
    const selectedUserType = document.querySelector('input[name="userType"]:checked')?.id;
    // if (selectedUserType === 'individual') {
    document.querySelector('.register-submit').classList.remove('d-none');
    // }
    // document.querySelector('.register-submit').classList.remove('d-none');
    hideLoader()
  } catch (error) {
    hideLoader()
    return handleMessage('error', 'Something went wrong', error.response.data.message);
  }
});

// Prevent form submission on Enter key except for the submit and verify buttons
document.querySelectorAll('.register-form input').forEach(input => {
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const isSubmitButton = event.target.classList.contains('register-submit');
      const isOtpButton = event.target.classList.contains('verify-otp');
      const phoneNumber = event.target.classList.contains('phoneNumber');
      const submitOtp = event.target.classList.contains('submitOtp');
      if (!isSubmitButton && !isOtpButton && !phoneNumber && !submitOtp) {
        event.preventDefault();
      }
    }
  });
});

document.querySelector(`input[name="otp"]`).addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('.verify-otp').click();
  }
});


const panNumberInput = document.getElementById('pancard')
panNumberInput.addEventListener('blur', async () => {
   try {
    showLoader()
    const response = await axios.post(`/get-name-pancard`, { panNumber: panNumberInput.value });
    if (response.data.data.name) {
      document.querySelector(`input[name="name"]`).value =
        response.data.data?.name;
      document.querySelector(`input[name="name"]`).readOnly = true
      hideLoader()
    }
  } catch (error) { hideLoader()}
})

const pincode = document.getElementById('pincode')

pincode.addEventListener('blur', async (event) => {
  const pincode = event.target.value;
  showLoader();
  try {
    const response = await axios.get(`/get-city-via-pincode/${pincode}`);
    if (response.data.data.name) {
      document.querySelector(`input[name="city"]`).value =
        response.data.data?.name;
      document.querySelector(`input[name="state"]`).value =
        response.data.data?.state;
    }
    hideLoader();
  } catch (error) {hideLoader(); }
})


document.getElementById('verifyGstButton').addEventListener('click', async (event) => {
  event.preventDefault();
  showLoader()
  const gstNoInput = document.getElementById('gstNumber');
  const gstNo = gstNoInput.value.trim();

  if (!gstNo) {
    return handleMessage('error', 'Invalid Gst Number!.', 'Please enter a valid GST number.');
  }

  try {
    const response = await axios.post('/verifyGstNo', { gstNo });
    if (response.data.data === null) {
      return handleMessage('error', 'Invalid Gst Number!.', 'Error verifying GST number. Please try again.');
    }
    hideLoader()
    // document.querySelector('.register-submit').classList.remove('d-none');
    return handleMessage('success', 'GST verified!', 'GST verification successful!');
  } catch (error) {
    hideLoader()
    return handleMessage('error', 'Invalid Gst Number!.', 'Error verifying GST number. Please try again.');
  }
});

document.getElementsByName('userType').forEach = Array.prototype.forEach;

document.getElementsByName('userType').forEach(function (radioButton) {
  radioButton.addEventListener('change', function (event) {
    if (event.target.id === "individual") {
      document.querySelector('.gst-control').classList.add('d-none');
      document.querySelector('.register-submit').classList.add('d-none');
    } else {
      document.querySelector('.gst-control').classList.remove('d-none');
      document.querySelector('.register-submit').classList.add('d-none');
    }
  });
});

document.getElementsByName('profile')[0].addEventListener('change', async (event) => {
  event.preventDefault();

  const profilePhoto = document.getElementsByName('profile')[0];
  if (profilePhoto) {
    document.querySelector('.responsiveFooter').style.marginTop = '400px';
  }
});








// Function to show/hide fields based on the selected checkbox
// function toggleFields() {
//   const individualCheckbox = document.getElementById('individual');
//   const partnershipCheckbox = document.getElementById('partnership');
//   const privateCheckbox = document.getElementById('private');

//   // Input fields
//   const individualFields = document.getElementById('gstNumber');
//   const partnershipFields = document.getElementById('aadhar');
//   const privateFields = document.getElementById('pincode');

//   // Show/hide based on checkbox state
//   individualFields.classList.toggle('d-none', !individualCheckbox.checked);
//   partnershipFields.classList.toggle('d-none', !partnershipCheckbox.checked);
//   privateFields.classList.toggle('d-none', !privateCheckbox.checked);
// }

// // Add event listeners to checkboxes
// document.getElementById('individual').addEventListener('change', toggleFields);
// document.getElementById('partnership').addEventListener('change', toggleFields);
// document.getElementById('private').addEventListener('change', toggleFields);
