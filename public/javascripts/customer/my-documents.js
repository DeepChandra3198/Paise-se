import { handleMessage } from "../helpers.js";

document
  .querySelector(".documents-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      let formData = new FormData(event.target);

      const response = await axios.post(`/customer/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleMessage("success", "Success", response.data.message);
      // setTimeout(() => {
      //   location.reload();
      // }, 1500);
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
