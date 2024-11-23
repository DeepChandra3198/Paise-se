import { handleMessage } from '../helpers.js';
let breId = '';
let cityUploadRoute = '';
let companyUploadRoute = '';

document.querySelector('.create-bre-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  // this is the formData object with the form data key value pairs
  formData = Object.fromEntries(formData.entries());
  try {
    const response = await axios.post('/admin/setup/bre', formData);
    const { status, message } = response.data;
    handleMessage('success', 'Success!', 'Bre created successfully!');
    event.target.reset();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelector('.edit-bre-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  // this is the formData object with the form data key value pairs
  formData = Object.fromEntries(formData.entries());

  try {
    const response = await axios.patch(`/admin/setup/bre/update/${breId}`, formData);
    const { status, message } = response.data;
    handleMessage('success', 'Success!', 'Bre updated successfully!');
    event.target.reset();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});

document.querySelectorAll('.edit-bre-btn').forEach((btn) => {
  btn.addEventListener('click', async (editBtn) => {
    const bre = JSON.parse(editBtn.target.parentElement.dataset.bre);
    breId = bre.id;
    document.querySelector('.bre-product-id').value = bre.productId;
    document.querySelector('.edit-bre-lender').value = bre.lender;
    const response = await axios.get(`/get-card-via-lender/${bre.lender}`);
    document.querySelector('.edit-bre-cards').innerHTML = response.data.data
      .map((card) => {
        return `<option ${bre.cardId === card.id ? `selected` : ``} value="${card.id}">${
          card.name
        }</option>`;
      })
      .join(' ');
    document.querySelector('.bre-age').value = bre.age;
    document.querySelector('.bre-income').value = bre.income;
    document.querySelector('.bre-company').options.forEach((option) => {
      bre.company.includes(option.value) ? (option.selected = true) : false;
    });
  });
});

document.querySelector('.new-bre-lender').addEventListener('change', async (event) => {
  const lender = event.target.value;
  if (lender.length === 0) {
    document.querySelector('.new-bre-cards').innerHTML = `<option value="">Select</option>`;
  }
  try {
    const response = await axios.get(`/get-card-via-lender/${lender}`);
    document.querySelector('.new-bre-cards').innerHTML = response.data.data
      .map((card) => {
        return `<option value="${card.id}">${card.name}</option>`;
      })
      .join(' ');
  } catch (error) {
    console.log(error);
  }
});

document.querySelector('.edit-bre-lender').addEventListener('change', async (event) => {
  const lender = event.target.value;
  if (lender.length === 0) {
    document.querySelector('.edit-bre-cards').innerHTML = `<option value="">Select</option>`;
  }
  try {
    const response = await axios.get(`/get-card-via-lender/${lender}`);
    document.querySelector('.edit-bre-cards').innerHTML = response.data.data
      .map((card) => {
        return `<option value="${card.id}">${card.name}</option>`;
      })
      .join(' ');
  } catch (error) {
    console.log(error);
  }
});

document.querySelectorAll('.add-city-btn').forEach((btns) => {
  btns.addEventListener('click', (btn) => {
    cityUploadRoute = btn.target.dataset.url;
    console.log(btn.target, cityUploadRoute);
  });
});

document.querySelectorAll('.add-company-btn').forEach((btns) => {
  btns.addEventListener('click', (btn) => {
    companyUploadRoute = btn.target.dataset.url;
    console.log(btn.target, companyUploadRoute);
  });
});

document.querySelector('.create-cities').addEventListener('submit', async (event) => {
  event.preventDefault();
  let formData = new FormData(event.target);
  try {
    const response = await axios.post(cityUploadRoute, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { status, message } = response.data;
    handleMessage('success', 'Success!', message);
    event.target.reset();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});
document.querySelectorAll('.view-cities').forEach((btns) => {
  btns.addEventListener('click', async (btn) => {
    const id = +btn.target.dataset.id;

    try {
      const response = await axios.get(`/admin/setup/bre-cities/${id}`);
      document.querySelector('.cities').innerHTML = response.data.data
        .map((city, index) => {
          return `
          <tr>
            <td>
              <p class="text-muted mb-0">${index}</p>
            </td>
            <td>
              <p class="text-muted mb-0">${city.city}</p>
            </td>
            <td>
              <p class="text-muted mb-0">${city.pincode}</p>
            </td>
          </tr>
          `;
        })
        .join(' ');
    } catch (error) {}
  });
});

document.querySelector('.create-companies').addEventListener('submit', async (event) => {
  event.preventDefault();
  let formData = new FormData(event.target);
  try {
    const response = await axios.post(companyUploadRoute, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { status, message } = response.data;
    handleMessage('success', 'Success!', message);
    event.target.reset();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    if (error.hasOwnProperty('response')) {
      return handleMessage('error', 'Something went wrong', error.response.data.message);
    } else {
      return handleMessage('error', 'Something went wrong', error.message);
    }
  }
});
document.querySelectorAll('.view-companies').forEach((btns) => {
  btns.addEventListener('click', async (btn) => {
    const id = +btn.target.dataset.id;

    try {
      const response = await axios.get(`/admin/setup/bre-companies/${id}`);
      document.querySelector('.companies').innerHTML = response.data.data
        .map((company, index) => {
          return `
          <tr>
            <td>
              <p class="text-muted mb-0">${index}</p>
            </td>
            <td>
              <p class="text-muted mb-0">${company.company}</p>
            </td>
          </tr>
          `;
        })
        .join(' ');
    } catch (error) {}
  });
});
