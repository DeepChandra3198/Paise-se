import { handleMessage } from "../helpers.js";

document
    .querySelector(".create-staff-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        formData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post("/admin/add-staff", formData);
            const { status, message } = response.data;

            handleMessage("success", "Success!", message);
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