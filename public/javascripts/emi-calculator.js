import { convertNumberToWords, convertNumberToCommaSeparated, allowOnlyNumber } from './helpers.js';

const loanAmountRangeInput = document.querySelector('.loan-amount-range');
const interestRateRangeInput = document.querySelector('.interest-rate-range');
const tenureRangeInput = document.querySelector('.tenure-range');

const loanAmountInput = document.querySelector('.loan-amount-input');
const interestRateInput = document.querySelector('.interest-rate-input');
const tenureInput = document.querySelector('.tenure-input');

loanAmountInput.addEventListener('paste', (event) => {
  event.preventDefault();
});

interestRateInput.addEventListener('paste', (event) => {
  event.preventDefault();
});

tenureInput.addEventListener('paste', (event) => {
  event.preventDefault();
});

loanAmountInput.addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const maxLoanAmount = +event.target.getAttribute('max');
  let value = parseFloat(event.target.value.replace(/,/g, ''));
  if (isNaN(value)) {
    value = 0;
  }
  if (value > maxLoanAmount) {
    event.target.value = maxLoanAmount;
    value = maxLoanAmount;
  }
  loanAmountRangeInput.value = value.toFixed(2);
  calculateEmi();
  console.log(value);
  loanAmountInput.value = convertNumberToCommaSeparated(value);
});

interestRateInput.addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const maxInterest = +event.target.getAttribute('max');
  let value = parseFloat(event.target.value);
  if (value > maxInterest) {
    event.target.value = maxInterest;
    value = maxInterest;
  }
  interestRateRangeInput.value = value.toFixed(2);
  calculateEmi();
});

tenureInput.addEventListener('keyup', (event) => {
  allowOnlyNumber(event);
  const maxTenure = +event.target.getAttribute('max');
  let value = parseFloat(event.target.value);
  if (value > maxTenure) {
    event.target.value = maxTenure;
    value = maxTenure;
  }
  tenureRangeInput.value = value.toFixed(2);
  calculateEmi();
});

loanAmountRangeInput.addEventListener('input', (event) => {
  loanAmountInput.value = parseFloat(event.target.value).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  calculateEmi();
});

interestRateRangeInput.addEventListener('input', (event) => {
  interestRateInput.value = parseFloat(event.target.value).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  calculateEmi();
});

tenureRangeInput.addEventListener('input', (event) => {
  tenureInput.value = parseFloat(event.target.value).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  calculateEmi();
});

function calculateEmi() {
  const loanAmount = parseFloat(loanAmountRangeInput.value);
  const interestRate = parseFloat(interestRateRangeInput.value);
  const loanTenure = parseFloat(tenureRangeInput.value);

  var monthlyInterest = interestRate / 12 / 100;
  var totalPayments = loanTenure * 12;
  var compoundedInterest = Math.pow(1 + monthlyInterest, totalPayments);
  var emi = (loanAmount * monthlyInterest * compoundedInterest) / (compoundedInterest - 1);
  var totalAmountPayable = emi * totalPayments;
  var totalInterestPayable = totalAmountPayable - loanAmount;

  document.querySelector('.emi-amount').innerHTML = convertNumberToCommaSeparated(emi);

  document.querySelector('.interest-amount').innerHTML =
    convertNumberToCommaSeparated(totalInterestPayable);

  document.querySelector('.total-amount-payable').innerHTML =
    convertNumberToCommaSeparated(totalAmountPayable);

  const wordify = convertNumberToWords(loanAmount).trim().toLowerCase();

  document.querySelector('.loan-amount-in-words').textContent =
    wordify.charAt(0).toUpperCase() + wordify.slice(1);

  loanAmountInput.value = convertNumberToCommaSeparated(loanAmount);
}

document.addEventListener('DOMContentLoaded', (event) => {
  calculateEmi();
});
