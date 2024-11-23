import { handleMessage } from "../helpers.js";

document
  .querySelector(".partner-connect-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      let formData = new FormData(event.target);

      formData = Object.fromEntries(formData.entries());
      const response = await axios.post(`/p-connect`, formData);
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

  document.querySelector(`input[name="pincode"]`).addEventListener('input', async (event) => {
    const pincode = event.target.value;
    try {
      const response = await axios.get(`/get-city-via-pincode/${pincode}`);
      if (response.data.data.name) {
        document.querySelector(`input[name="city"]`).value = response.data.data?.name;
        document.querySelector(`input[name="state"]`).value = response.data.data?.state;
      }
    } catch (error) {}
  });
