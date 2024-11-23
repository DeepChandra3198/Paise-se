import { handleMessage } from "../helpers.js";
let faqId = "";

document
    .querySelector(".create-offer-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        // formData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post("/admin/offer", formData);
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

document
    .querySelector(".edit-offer-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        // formData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.patch(
                `/admin/offer/update/${faqId}`,
                formData
            );
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

document.querySelectorAll(".edit-offer-btn").forEach((btn) => {
    btn.addEventListener("click", (editBtn) => {
        const offer = editBtn.target.parentElement.dataset.offer;
        faqId = editBtn.target.parentElement.dataset.id;
        document.querySelector(".offer-offer").value = offer;
    });
});
