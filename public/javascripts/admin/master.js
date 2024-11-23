import { handleMessage } from "../helpers.js";
import { fileValidation } from "./validations/fileValidation.js";
let masterId = "";

document
  .querySelector(".create-master-form")
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
      const response = await axios.post("/admin/setup/master", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Master created successfully!");
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
  .querySelector(".edit-master-form")
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
        `/admin/setup/master/update/${masterId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Master updated successfully!");
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

document.querySelectorAll(".edit-master-btn").forEach((btn) => {
  btn.addEventListener("click", (editBtn) => {
    const name = editBtn.target.parentElement.dataset.name;
    masterId = editBtn.target.parentElement.dataset.id;
    document.querySelector(".master-name").value = name;
  });
});
