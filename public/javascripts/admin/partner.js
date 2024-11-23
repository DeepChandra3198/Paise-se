import { handleMessage } from "../helpers.js";
import { fileValidation } from "./validations/fileValidation.js";
let partnerId = "";

document
  .querySelector(".create-partner-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    // validate file upload
    if (!fileValidation(".icon")) {
      return;
    }

    try {
      const response = await axios.post("/admin/partner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Partner created successfully!");
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
  .querySelector(".edit-partner-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    // validate file upload
    if (!fileValidation(".edit-icon")) {
      return;
    }

    try {
      const response = await axios.patch(
        `/admin/partner/update/${partnerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Partner updated successfully!");
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

document.querySelectorAll(".edit-partner-btn").forEach((btn) => {
  btn.addEventListener("click", (editBtn) => {
    const name = editBtn.target.parentElement.dataset.name;
    const sort = editBtn.target.parentElement.dataset.sort;
    partnerId = editBtn.target.parentElement.dataset.id;
    document.querySelector(".partner-name").value = name;
    document.querySelector(".partner-sort").value = sort;
  });
});
