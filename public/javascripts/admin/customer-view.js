import { handleMessage } from '../helpers.js';

document.querySelector('.customer-status-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        let formData = new FormData(event.target);

        const url = window.location.href;
        const parts = url.split("/");
        const number = parts[parts.length - 1];

        // formData = Object.fromEntries(formData.entries());
        formData = Object.fromEntries(formData.entries());
        formData.status = formData.status

        const response = await axios.post(`/admin/customer-status/${number}`, formData);
        handleMessage('success', 'Success', response.data.message);
        setTimeout(() => {
            window.location.reload()
        }, 2000)
    } catch (error) {
        if (error.hasOwnProperty('response')) {
            return handleMessage('error', 'Something went wrong', error.response.data.message);
        } else {
            return handleMessage('error', 'Something went wrong', error.message);
        }
    }
});

const statusSelect = document.getElementById('statusSelect')
const remark = document.getElementById('remark')
const role = document.getElementById('role')
const agentCategory = document.getElementById('agentCategory')

statusSelect.addEventListener('change', () => {
    remark.classList.remove('d-none')
    if (statusSelect.value === 'Pending For Document') {
        role.classList.add('d-none')
        agentCategory.classList.add('d-none')
    }
    else  if (statusSelect.value === 'Approved') {
        role.classList.remove('d-none')
        agentCategory.classList.remove('d-none')
    }
    else {
        role.classList.add('d-none')
        agentCategory.classList.add('d-none')
    }
})