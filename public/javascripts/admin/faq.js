import { handleMessage } from "../helpers.js";
let faqId = "";

document
  .querySelector(".create-faq-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    formData.productId = parseInt(formData.productId);

    try {
      const response = await axios.post("/admin/faq", formData);
      const { status, message } = response.data;

      handleMessage("success", "Success!", "FAQ created successfully!");
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
  .querySelector(".edit-faq-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    // this is the formData object with the form data key value pairs
    formData = Object.fromEntries(formData.entries());
    formData.productId = parseInt(formData.productId);

    try {
      const response = await axios.patch(
        `/admin/faq/update/${faqId}`,
        formData
      );
      const { status, message } = response.data;

      handleMessage("success", "Success!", "FAQ updated successfully!");
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

document.querySelectorAll(".edit-faq-btn").forEach((btn) => {
  btn.addEventListener("click", (editBtn) => {
    const productId = editBtn.target.parentElement.dataset.productId;
    const question = editBtn.target.parentElement.dataset.question;
    const answer = editBtn.target.parentElement.dataset.answer;
    faqId = editBtn.target.parentElement.dataset.id;
    document.querySelector(".faq-product-id").value = productId;
    document.querySelector(".faq-question").value = question;
    document.querySelector(".faq-answer").value = answer;
  });
});
