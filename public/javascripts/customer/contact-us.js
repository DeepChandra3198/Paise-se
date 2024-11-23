import { handleMessage } from "../helpers.js";

document
  .querySelector(".contact-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      let formData = new FormData(event.target);

      formData = Object.fromEntries(formData.entries());
      const response = await axios.post(`/contact-us`, formData);
      event.target.reset();
      Swal.fire({
        title: "Thank You",
        text: response.data.message,
        imageUrl: `/images/success-icon.png`,
        allowOutsideClick: false,
      });
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
