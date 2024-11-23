import { handleMessage } from "../helpers.js";
let bankGradeMasterId = "";

document
  .querySelector(".create-bank-grade-master-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post(
        "/admin/setup/bank-grade-master",
        formData
      );
      const { status, message } = response.data;
      handleMessage(
        "success",
        "Success!",
        "Bank grade master created successfully!"
      );
      event.target.reset();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      if (error.hasOwnProperty("response")) {
        return handleMessage(
          "error",
          "Something went wrong",
          error.response.data.message
        );
      } else {
        return handleMessage("error", "Something went wrong", error.message);
      }
    }
  });

document
  .querySelector(".edit-bank-grade-master-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.patch(
        `/admin/setup/bank-grade-master/update/${bankGradeMasterId}`,
        formData
      );
      const { status, message } = response.data;
      handleMessage(
        "success",
        "Success!",
        "Bank grade master updated successfully!"
      );
      event.target.reset();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      if (error.hasOwnProperty("response")) {
        return handleMessage(
          "error",
          "Something went wrong",
          error.response.data.message
        );
      } else {
        return handleMessage("error", "Something went wrong", error.message);
      }
    }
  });

document.querySelectorAll(".edit-bank-grade-master-btn").forEach((btn) => {
  btn.addEventListener("click", async (editBtn) => {
    const bankGradeMaster = JSON.parse(
      editBtn.target.parentElement.dataset.bankGradeMaster
    );
    bankGradeMasterId = bankGradeMaster.id;
    document.querySelector(".edit-bank-grade-master-bank-name").value =
      bankGradeMaster.bankName;
    document.querySelector(".edit-bank-grade-master-grade").value =
      bankGradeMaster.grade;
    document.querySelector(".edit-bank-grade-master-foir").value =
      bankGradeMaster.foir;
  });
});
