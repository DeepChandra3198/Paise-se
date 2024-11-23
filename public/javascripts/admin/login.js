import { handleMessage } from "../helpers.js";

document
  .querySelector(".login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      let formData = new FormData(event.target);
      formData = Object.fromEntries(formData.entries());
      const response = await axios.post("/admin/login", formData);
      handleMessage("success", "Success", response.data.message);
      setTimeout(() => {
        location.href = "/admin/dashboard";
      }, 1000);
    } catch (error) {
      return handleMessage(
        "error",
        "Something went wrong",
        error.response.data.message
      );
    }
  });
