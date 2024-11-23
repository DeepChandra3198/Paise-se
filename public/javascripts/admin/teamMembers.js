import { handleMessage } from '../helpers.js';
import { fileValidation } from './validations/fileValidation.js';
let teamMemberId = null;

if (
  document.querySelector('.create-team-member-form') !== undefined &&
  document.querySelector('.create-team-member-form') !== null
) {
  document.querySelector('.create-team-member-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);

    if (!fileValidation('.team-photo')) {
      return;
    }

    try {
      const response = await axios.post('/admin/setup/team-members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { status, message } = response.data;

      handleMessage('success', 'Success!', message);
      event.target.reset();
      setTimeout(() => {
        location.href = '/admin/setup/team-members';
      }, 1000);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        return handleMessage('error', 'Something went wrong', error.response.data.message);
      } else {
        return handleMessage('error', 'Something went wrong', error.message);
      }
    }
  });
}

if (
  document.querySelector('.edit-team-member-form') !== undefined &&
  document.querySelector('.edit-team-member-form') !== null
) {
  document.querySelector('.edit-team-member-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);

    if (!fileValidation('.edit-team-photo')) {
      return;
    }

    try {
      const response = await axios.patch(
        `/admin/setup/team-members/update/${teamMemberId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { status, message } = response.data;

      handleMessage('success', 'Success!', message);
      event.target.reset();
      setTimeout(() => {
        location.href = '/admin/setup/team-members';
      }, 1000);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        return handleMessage('error', 'Something went wrong', error.response.data.message);
      } else {
        return handleMessage('error', 'Something went wrong', error.message);
      }
    }
  });
}

document.querySelectorAll('.edit-team-member-btn').forEach((btn) => {
  console.log('heya');
  btn.addEventListener('click', async (editBtn) => {
    console.log(editBtn.target, editBtn.target.parentElement.dataset.id);
    teamMemberId = editBtn.target.parentElement.dataset.id;

    const response = await axios.get(`/admin/setup/team-members/edit/${teamMemberId}`);
    const teamMember = response.data.data;
    document.querySelector('.team-name').value = teamMember.name;
    document.querySelector('.team-designation').value = teamMember.designation;
    document.querySelector('.team-linkedin').value = teamMember.linkedIn;
    document.querySelector('.team-about').value = teamMember.about;
  });
});
