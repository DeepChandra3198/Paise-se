import { handleMessage } from '../helpers.js';

let otpID = 0;
const productId = new URL(window.location.href).pathname.split('/').pop();

function redirect() {
  switch (productId) {
    case 'login':
      location.href = `/customer/dashboard`;
      break;
    case '':
      location.href = `/customer/dashboard`;
      break;
    case '1':
      location.href = `/customer-info/${productId}`;
      break;
    case '2':
      location.href = `/personal-loan-enquiry/${productId}`;
      break;
    case '3':
      location.href = `/business-loan-enquiry/${productId}`;
      break;
    case '4':
      location.href = `/home-loan-enquiry/${productId}`;
      break;
    case '5':
      location.href = `/lap-loan-enquiry/${productId}`;
      break;
    case '6':
      location.href = `/two-wheeler-loan-enquiry/${productId}`;
      break;
    case '7':
      location.href = `/car-loan-enquiry/${productId}`;
      break;
    case '8':
      location.href = `/family-doctor-enquiry/${productId}`;
      break;
    case '9':
      location.href = `/health-insurance-enquiry/${productId}`;
      break;
    default:
      handleMessage('warning', 'Warning', 'Coming Soon!');
      break;
  }
}

document.querySelector('.mobile-otp-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {

    const phone = document.querySelector(`input[name="phone"]`).value;
    const password = document.querySelector(`input[name="password"]`).value;
    const response = await axios.post('/login-otp-validate', { phone, password });
    if (response.data.status === 'error') {
      return handleMessage('error', 'Something went wrong', response.data.message);
    }
    handleMessage('success', 'Success', response.data.message);
    return redirect();
    // document.querySelector(".sent-otp").textContent = response.data.data.otp;
  } catch (error) {
    return handleMessage('error', 'Something went wrong', error.response.data.message);
  }
});

// document.querySelector('.verify-otp').addEventListener('click', async () => {
//   const otp = document.querySelector(`input[name="otp"]`).value;
//   if (otp.length !== 4)
//     return handleMessage('error', 'Something went wrong', 'Login Code must be of 4 digits only');

//   try {
//     const response = await axios.post(`/login-otp-validate/${otpID}/${otp}`);
//     handleMessage('success', 'Success', response.data.message);
//     return redirect();
//   } catch (error) {
//     return handleMessage('error', 'Something went wrong', error.response.data.message);
//   }
// });

// document.querySelector('.resend-otp')?.addEventListener('click' , async (e) => {
//   e.preventDefault();
//   const phone = document.querySelector(`input[name="phone"]`).value;
//   const response = await axios.post('/login-otp', { phone });
//   handleMessage('success', 'Success', response.data.message);
//   otpID = response.data.data.id;
//   document.querySelector('.resend-otp').classList.add('d-none');
// })

document.querySelector('.check-offers')?.addEventListener('click', () => {
  return redirect();
});
