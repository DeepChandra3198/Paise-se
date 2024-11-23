import { handleMessage } from '../helpers.js';

let otpID = 0;

document.querySelector('.reset-password-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);

    formData = Object.fromEntries(formData.entries());
    let url = `/reset-password/${otpID}/${formData.otp}/${formData.password}/${formData.phone}`
    const response = await axios.post(url);
    handleMessage('success', 'Success', response.data.message);
    setTimeout(()=>{
        window.location.href = `/login`
    },2000)
  } catch (error) {
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
  try {
    console.log('clickedd reset')
    // if (otpID !== 0) {
    //   document.querySelector('.verify-otp').click();
    //   return;
    // }
    const phone = document.querySelector(`input[name="phone"]`).value;
    const response = await axios.post('/login-otp', { phone });
    if(response.data.status === 'error'){
      console.log('===========>>>>>>>>>>>.hei')
      return handleMessage('error', 'Something went wrong', response.data.message);
    }
    handleMessage('success', 'Success', response.data.message);
    // document.querySelector(".sent-otp").textContent = response.data.data.otp;
    otpID = response.data.data.id;
    document.querySelector(`input[name="phone"]`).setAttribute('readonly', true);
    document.querySelector('.send-otp').classList.add('d-none');
    document.querySelector('.send-otp').disabled = true
    document.querySelector('.input-otp-div').classList.remove('d-none');
    document.querySelector('.password').classList.remove('d-none');
    document.querySelector('.conf-password').classList.remove('d-none');
    document.querySelector('.reset-submit').classList.remove('d-none');
  } catch (error) {
    return handleMessage('error', 'Something went wrong', error);
  }
});

// document.querySelector('.verify-otp').addEventListener('click', async () => {
//   const otp = document.querySelector(`input[name="otp"]`).value;
//   if (otp.length !== 4)
//     return handleMessage('error', 'Something went wrong', 'Login Code must be of 4 digits only');

//   try {
//     const response = await axios.post(`/register-otp-validate/${otpID}/${otp}`);
//     handleMessage('success', 'Success', response.data.message);
//     document.querySelector('.input-otp-div').classList.toggle('d-none');
//     document.querySelector('.password').classList.toggle('d-none');
//     document.querySelector('.conf-password').classList.toggle('d-none');
//     document.querySelector('.reset-submit').classList.toggle('d-none');
//   } catch (error) {
//     return handleMessage('error', 'Something went wrong', error.response.data.message);
//   }
// });