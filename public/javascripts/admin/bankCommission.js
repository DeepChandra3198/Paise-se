import { handleMessage } from "../helpers.js";
let faqId = "";

document
    .querySelector(".create-bankCommission-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        let formData = new FormData(event.target);
        // this is the formData object with the form data key value pairs
        formData = Object.fromEntries(formData.entries());
        formData.payoutPercent = parseFloat(formData.payoutPercent);

        try {
            const response = await axios.post("/admin/bankCommission", formData);
            const { status, message } = response.data;

            handleMessage("success", "Success!", "Bank Commission created successfully!");
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
        const bank = editBtn.target.parentElement.dataset.bank;
        const loanType = editBtn.target.parentElement.dataset.loanType;
        const agentCategory = editBtn.target.parentElement.dataset.agentCategory;
        const payoutPercent = editBtn.target.parentElement.dataset.payoutPercent;
        faqId = editBtn.target.parentElement.dataset.id;
        document.querySelector(".faq-bank").value = bank;
        document.querySelector(".faq-loanType").value = loanType;
        document.querySelector(".faq-agentCategory").value = agentCategory;
        document.querySelector(".faq-payout").value = payoutPercent;
    });
});
