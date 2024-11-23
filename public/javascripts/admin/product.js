import { handleMessage } from '../helpers.js';
import { fileValidation } from './validations/fileValidation.js';
let productId = '';

document.querySelector('.create-product-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  // this is the formData object with the form data key value pairs
  formData = Object.fromEntries(formData.entries());
  // validate file upload
  if (!fileValidation('.icon')) {
    return;
  }
  if (!fileValidation('.tag-line-icon')) {
    return;
  }

  try {
    const response = await axios.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { status, message } = response.data;
    handleMessage('success', 'Success!', 'Product created successfully!');
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

document.querySelector('.edit-product-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  let formData = new FormData(event.target);
  // this is the formData object with the form data key value pairs
  formData = Object.fromEntries(formData.entries());
  // validate file upload
  if (!fileValidation('.edit-icon')) {
    return;
  }
  if (!fileValidation('.tag-line-icon')) {
    return;
  }

  try {
    const response = await axios.patch(`/admin/products/update/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { status, message } = response.data;

    handleMessage('success', 'Success!', 'Product updated successfully!');
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

document.querySelectorAll('.edit-product-btn').forEach((btn) => {
  btn.addEventListener('click', (editBtn) => {
    const product = JSON.parse(editBtn.target.parentElement.dataset.product);
    productId = product.id;
    document.querySelector('.product-name').value = product.name;
    document.querySelector('.product-short-desc').value = product.shortDescription;
    document.querySelector('.product-long-desc').value = product.longDescription;
    document.querySelector('.product-tag-line-title').value = product.tagLineTitle;
    document.querySelector('.product-tag-line-one').value = product.tagLineOne;
    document.querySelector('.product-tag-line-two').value = product.tagLineTwo;
    document.querySelector('.product-tag-line-three').value = product.tagLineThree;
    document.querySelector('.product-tag-line-four').value = product.tagLineFour;
    document.querySelector('.product-tag-line-five').value = product.tagLineFive;
    document.querySelector('.product-home-page-visibility').value =
      product.isVisibleOnHomePage === true ? '1' : '0';
    document.querySelector('.product-sort').value = product.sort;
    document.querySelector('#editButtonName').value = product.buttonName;
  });
});
