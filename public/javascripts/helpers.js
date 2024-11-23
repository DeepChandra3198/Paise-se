const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export function handleValidationErrors(errors) {
  if (errors) {
    for (let [key, obj] of Object.entries(errors)) {
      Toast.fire({
        icon: 'error',
        title: 'Uh Oh!',
        text: obj[0],
      });
      break;
    }
    return true;
  }
  return false;
}

export function handleMessage(icon, title, message) {
  if (message) {
    Toast.fire({
      icon,
      title,
      text: message,
    });
    return true;
  }
  return false;
}

export function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper function to check if a character is an alphabet
function isAlphabetCharacter(char) {
  return /^[A-Za-z]$/.test(char);
}

// Helper function to check if a character is numeric
function isNumericCharacter(char) {
  return /^[0-9]$/.test(char);
}

export function checkStringFormat(str) {
  // Check if the string length is 10
  if (str.length !== 10) {
    return false;
  }

  // Check if the first 5 characters are alphabets
  for (var i = 0; i < 5; i++) {
    if (!isAlphabetCharacter(str[i])) {
      return false;
    }
  }

  // Check if the next 4 characters are numerics
  for (var j = 5; j < 9; j++) {
    if (!isNumericCharacter(str[j])) {
      return false;
    }
  }

  // Check if the last character is an alphabet
  if (!isAlphabetCharacter(str[9])) {
    return false;
  }

  // If all checks pass, the string format is valid
  return true;
}

export const convertNumberToWords = (num) => {
  const single = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    'Ten',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const formatTenth = (digit, prev) => {
    return 0 == digit ? '' : ' ' + (1 == digit ? double[prev] : tens[digit]);
  };
  const formatOther = (digit, next, denom) => {
    return (
      (0 != digit && 1 != next ? ' ' + single[digit] : '') +
      (0 != next || digit > 0 ? ' ' + denom : '')
    );
  };
  let res = '';
  let index = 0;
  let digit = 0;
  let next = 0;
  let words = [];
  if (((num += ''), isNaN(parseInt(num)))) {
    res = '';
  } else if (parseInt(num) > 0 && num.length <= 10) {
    for (index = num.length - 1; index >= 0; index--)
      switch (
        ((digit = num[index] - 0),
        (next = index > 0 ? num[index - 1] - 0 : 0),
        num.length - index - 1)
      ) {
        case 0:
          words.push(formatOther(digit, next, ''));
          break;
        case 1:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 2:
          words.push(
            0 != digit
              ? ' ' +
                  single[digit] +
                  ' Hundred' +
                  (0 != num[index + 1] && 0 != num[index + 2] ? ' and' : '')
              : ''
          );
          break;
        case 3:
          words.push(formatOther(digit, next, 'Thousand'));
          break;
        case 4:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 5:
          words.push(formatOther(digit, next, 'Lakh'));
          break;
        case 6:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 7:
          words.push(formatOther(digit, next, 'Crore'));
          break;
        case 8:
          words.push(formatTenth(digit, num[index + 1]));
          break;
        case 9:
          words.push(
            0 != digit
              ? ' ' +
                  single[digit] +
                  ' Hundred' +
                  (0 != num[index + 1] || 0 != num[index + 2] ? ' and' : ' Crore')
              : ''
          );
      }
    res = words.reverse().join('');
  } else {
    res = '';
  }
  return res;
};

export const allowOnlyNumber = (event) => {
  const key = event.key;
  // Allow numeric digits, dot, backspace, delete, and arrow keys
  if (
    !/[\d\.]|Backspace|Delete|ArrowLeft|ArrowRight/.test(key) ||
    (key === '.' && numericInput.value.includes('.'))
  ) {
    event.preventDefault();
  }
};

export const convertNumberToCommaSeparated = (number) => {
  if (isNaN(number)) {
    return 0;
  }
  return parseFloat(number).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
};
