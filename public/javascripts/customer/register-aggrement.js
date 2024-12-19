import { handleMessage } from '../helpers.js';


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

document.querySelector('.register-aggrement-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const url = window.location.href;
    const parts = url.split("/");
    const number = parts[parts.length - 1];

    // formData = Object.fromEntries(formData.entries());
    showLoader()
    const response = await axios.post(`/register-aggrement/${number}`);
    handleMessage('success', 'Success', 'Registration Successful');
    setTimeout(() => {
      window.location.href = `/set-password/${number}`
    }, 3000)
    hideLoader()
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});