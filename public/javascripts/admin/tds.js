import { handleMessage } from "../helpers.js";
let faqId = "";


document
    .querySelector(".create-tds-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        formData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post("/admin/tds", formData);
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
    .querySelector(".edit-tds-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        formData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.patch(
                `/admin/tds/update/${faqId}`,
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

document.querySelectorAll(".edit-tds-btn").forEach((btn) => {
    btn.addEventListener("click", (editBtn) => {
        const name = editBtn.target.parentElement.dataset.role;
        const percent = editBtn.target.parentElement.dataset.percent;
        faqId = editBtn.target.parentElement.dataset.id;
        document.querySelector(".tds-name").value = name;
        document.querySelector(".tds-percent").value = percent;
    });
});
