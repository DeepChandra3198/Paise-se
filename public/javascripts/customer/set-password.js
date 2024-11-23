import { handleMessage } from '../helpers.js';

document.querySelector('.set-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        let formData = new FormData(event.target);

        const url = window.location.href;
        const parts = url.split("/");
        const number = parts[parts.length - 1];

        formData = Object.fromEntries(formData.entries());
        
        if (formData.password !== formData.confirmPassword) {
            return handleMessage('error', 'Something went wrong' , 'Enter Same Passwords');
        }
        const response = await axios.post(`/set-password/${number}`, formData);
        handleMessage('success', 'Success', response.data.message);
        setTimeout(() => {
            window.location.href = `/login`
        }, 3000)
    } catch (error) {
        if (error.hasOwnProperty('response')) {
            return handleMessage('error', 'Something went wrong', error.response.data.message);
        } else {
            return handleMessage('error', 'Something went wrong', error.message);
        }
    }
});