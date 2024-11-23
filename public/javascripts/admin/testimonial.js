import { handleMessage } from "../helpers.js";
import { fileValidation } from "./validations/fileValidation.js";
let testimonialId = "";

document
  .querySelector(".create-testimonial-form")
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
      const response = await axios.post("/admin/testimonial", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Testimonial created successfully!");
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
  .querySelector(".edit-testimonial-form")
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
        `/admin/testimonial/update/${testimonialId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { status, message } = response.data;

      handleMessage("success", "Success!", "Testimonial updated successfully!");
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

document.querySelectorAll(".edit-testimonial-btn").forEach((btn) => {
  btn.addEventListener("click", (editBtn) => {
    const testimonial = JSON.parse(
      editBtn.target.parentElement.dataset.testimonial
    );
    testimonialId = testimonial.id;
    document.querySelector(".testimonial-name").value = testimonial.name;
    document.querySelector(".testimonial-designation").value =
      testimonial.designation;
    document.querySelector(".testimonial-content").value = testimonial.content;
  });
});
