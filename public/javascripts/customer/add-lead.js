import { handleMessage } from '../helpers.js';

document.querySelector('.add-lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    let formData = new FormData(event.target);
    console.log(formData, '====>>>>lead')

    // const url = window.location.href;
    // const parts = url.split("/");
    // const number = parts[parts.length - 1];

    // formData = Object.fromEntries(formData.entries());
    const response = await axios.post(`/lead`, formData);
    handleMessage('success', 'Success', response.data.message);
    setTimeout(() => {
      window.location.href = '/customer/dashboard'
    }, 2000)
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});


$('.lead-form-element').addClass('d-none');

$('.loan-type').on('change', async (event) => {
  event.preventDefault();
  $('.lead-form-element').removeClass('d-none');
  $('.productSelection').addClass('d-none');
  console.log('workinggggggggggggg')
  $('.lead-form-element').addClass('d-none');
  if ($('.loan-type').val() == 'Business Loan') {
    $('.business-loan-element').removeClass('d-none');
    $('.productSelection').removeClass('d-none');
    const selectOptionLabel = document.getElementById('prodSelectionLabel')
    selectOptionLabel.innerHTML = `Entity Type`
    const selectOption = document.getElementById('productSelection')
    document.querySelector(`input[name="customerName"]`).required = false;
    selectOption.innerHTML = `
    <option value="">Select</option>
    <option value="Prop Company">Prop Company</option>
    <option value="Partnership Comapny">Partnership Comapny</option>
    <option value="For Company Pvt/ltd">For Company Pvt/ltd</option>
    <option value="LLP">LLP</option>`
  }
  else if ($('.loan-type').val() == 'Personal Loan') {
    $('.personal-loan-element').removeClass('d-none');
    $('.productSelection').removeClass('d-none');
    const selectOptionLabel = document.getElementById('prodSelectionLabel')
    selectOptionLabel.innerHTML = `Product Selection`
    const selectOption = document.getElementById('productSelection')
    selectOption.innerHTML = `
    <option value="">Select</option>
    <option value="OD">OD</option>
    <option value="BT">BT</option>
    <option value="Fresh">Fresh</option>`
  }
  else if ($('.loan-type').val() == 'Prof Loan') {
    $('.professional-loan-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Credit Card') {
    $('.credit-card-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Home Loan') {
    $('.home-loan-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Loan Against Property') {
    $('.lap-loan-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Vehicle Loan') {
    $('.vehicle-loan-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Family Doctor') {
    $('.family-doctor-element').removeClass('d-none');
  }
  else if ($('.loan-type').val() == 'Health Insurance') {
    $('.health-insurance-element').removeClass('d-none');
    $('.productSelection').removeClass('d-none');
    const selectOptionLabel = document.getElementById('prodSelectionLabel')
    selectOptionLabel.innerHTML = `Product Selection`
    const selectOption = document.getElementById('productSelection')
    selectOption.innerHTML = `
    <option value="">Select</option>
    <option value="Health Insurance">Health Insurance</option>
    <option value="Personal Accidental Cover">Personal Accidental Cover</option>
    <option value="Hospital Daily Cash">Hospital Daily Cash</option>`
  }
})

$('#add-doc-1').on('click', async (event) => {
  event.preventDefault();
  $('#add-doc-1').addClass('d-none')
  $('#other-doc1').removeClass('d-none')
  $('#add-doc-2').removeClass('d-none')
})

$('#add-doc-2').on('click', async (event) => {
  event.preventDefault();
  $('#add-doc-2').addClass('d-none')
  $('#other-doc2').removeClass('d-none')
  $('#add-doc-3').removeClass('d-none')
})

$('#add-doc-3').on('click', async (event) => {
  event.preventDefault();
  $('#add-doc-3').addClass('d-none')
  $('#other-doc3').removeClass('d-none')
  $('#add-doc-4').removeClass('d-none')
})

$('#add-doc-4').on('click', async (event) => {
  event.preventDefault();
  $('#add-doc-4').addClass('d-none')
  $('#other-doc4').removeClass('d-none')
})

$('.nav-link').on('click', (event) => {
  event.preventDefault()
  dashboard.classList.remove('active')
  dashboard.classList.remove('show')
  $
})

$('#dashboard-tab').on('click', (event) => {
  event.preventDefault()
  dashboard.classList.add('active')
  dashboard.classList.add('show')
  $
})

const dashboard = document.getElementById('dashboard')
const paymentRecoil = document.getElementById('paymentR')
const addLead = document.getElementById('lead')
const leadHistory = document.getElementById('leadH')
const profile = document.getElementById('security')
const url = window.location.href
const tab = url.split('?')?.[1]?.split('&')?.[0]?.split('=')?.[1]

console.log(tab, 'url.split()[1]')

// if (!url.split('?')) {
//   console.log('window.location.href = "/customer/dashboard?tab=1"')
//   window.location.href = "/customer/dashboard?tab=1"
// }

if (tab == 1) {
  $('.tab-pane').removeClass('active');
  $('.tab-pane').removeClass('show');
  dashboard.classList.add('active')
  dashboard.classList.add('show')
} else if (tab == 2) {
  $('.tab-pane').removeClass('active');
  $('.tab-pane').removeClass('show');
  profile.classList.add('active')
  profile.classList.add('show')
} else if (tab == 3) {
  $('.tab-pane').removeClass('active');
  $('.tab-pane').removeClass('show');
  addLead.classList.add('active')
  addLead.classList.add('show')
} else if (tab == 4) {
  $('.tab-pane').removeClass('active');
  $('.tab-pane').removeClass('show');
  leadHistory.classList.add('active')
  leadHistory.classList.add('show')
} else if (tab == 5) {
  $('.tab-pane').removeClass('active');
  $('.tab-pane').removeClass('show');
  paymentRecoil.classList.add('active')
  paymentRecoil.classList.add('show')
}


const leadSearch = document.getElementById('leadSearch')
const leadCustomerName = document.getElementById('leadCustomerName')
const leadCompanyName = document.getElementById('leadCompanyName')
const leadPhone = document.getElementById('leadPhone')

leadSearch.addEventListener('click', async () => {
  const leadCustomerNameValue = leadCustomerName.value;
  const leadCompanyNameValue = leadCompanyName.value;
  const leadPhoneValue = leadPhone.value;
  let url = `${window.location.href.split('/customer')[0]}/customer/dashboard?tab=4&leadCustomerName=${leadCustomerName.value}&leadCompanyName=${leadCompanyName.value}&leadPhone=${leadPhone.value}`
  console.log('hsssssssssssssshhhhhhhhshhhhhsh', url, window.location.href.split('/customer')[0])
  window.location.href = url
})

const pincode = document.getElementById('pincode')

pincode.addEventListener('blur', async (event) => {
  const pincode = event.target.value;
  try {
    const response = await axios.get(`/get-city-via-pincode/${pincode}`);
    if (response.data.data.name) {
      document.querySelector(`input[name="city"]`).value =
        response.data.data?.name;
      document.querySelector(`input[name="state"]`).value =
        response.data.data?.state;
    }
  } catch (error) { }
})

const locationPin = document.getElementById('location-pin')

locationPin.addEventListener('blur', async (event) => {
  const pincode = event.target.value;
  try {
    const response = await axios.get(`/get-city-via-pincode/${pincode}`);
    if (response.data.data.name) {
      document.querySelector(`#pin-state`).value =
        response.data.data?.state;
      document.querySelector(`#pin-city`).value =
        response.data.data?.name;
    }
  } catch (error) { }
})

const dashboardFrom = document.getElementById('dashboardFrom')
const dashboardTo = document.getElementById('dashboardTo')

dashboardFrom.addEventListener('change' , async ()=>{
  console.log(new Date(dashboardFrom.value) , new Date(dashboardTo.value) , 'changed')
})
dashboardTo.addEventListener('change' , async ()=>{
  console.log(new Date(dashboardFrom.value) , new Date(dashboardTo.value) , 'changed')
})