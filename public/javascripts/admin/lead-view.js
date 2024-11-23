import { handleMessage } from '../helpers.js';

document.querySelector('.lead-status-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        let formData = new FormData(event.target);

        const url = window.location.href;
        const parts = url.split("/");
        const number = parts[parts.length - 1];

        // formData = Object.fromEntries(formData.entries());
        formData = Object.fromEntries(formData.entries());
        formData.status = formData.status

        const response = await axios.post(`/admin/lead-status/${number}`, formData);
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
const disbursedAmount = document.getElementById('disbursedAmount')
const leadRemark = document.getElementById('leadRemark')
const bankName = document.getElementById('bankName')
const payoutPercent = document.getElementById('payoutPercent')

statusSelect.addEventListener('change', () => {
    leadRemark.classList.remove('d-none')
    if (statusSelect.value === 'Disbursed') {
        disbursedAmount.classList.remove('d-none')
        payoutPercent.classList.remove('d-none')
        bankName.classList.remove('d-none')
    }
    else if (statusSelect.value === 'Documents Pending') {
        disbursedAmount.classList.add('d-none')
        payoutPercent.classList.add('d-none')
        bankName.classList.add('d-none')
    }
    else {
        disbursedAmount.classList.add('d-none')
        payoutPercent.classList.add('d-none')
        bankName.classList.add('d-none')
    }
})