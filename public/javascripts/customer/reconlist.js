document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".row-checkbox");
  const selectAllCheckbox = document.getElementById("select-all");
  const totalAmountEl = document.getElementById("total-amount");
  const advanceTotalAmountEl = document.getElementById("advance-total-amount");
  const generateInvoiceBtn = document.getElementById("generate-invoice");

  function getLastDateOfPreviousMonth() {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return new Date(firstDayOfCurrentMonth - 1);
  }

  function getFirstDateOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const lastDateOfPreviousMonth = getLastDateOfPreviousMonth();
  const firstDateOfCurrentMonth = getFirstDateOfCurrentMonth();

  function updateTotalAmount() {
    let total = 0;
    let advanceTotal = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const amount = parseFloat(checkbox.getAttribute("data-netpayout"));
        const disbursedAt = new Date(checkbox.getAttribute("data-disbursedAt"));
        if (disbursedAt >= firstDateOfCurrentMonth) {
          advanceTotal += amount;
        } else {
          total += amount;
        }
      }
    });
    totalAmountEl.textContent = total.toLocaleString("en-IN");
    advanceTotalAmountEl.textContent = advanceTotal.toLocaleString("en-IN");
  }

  checkboxes.forEach((checkbox) => {
    const disbursedAt = new Date(checkbox.getAttribute("data-disbursedAt"));
    const userRole = checkbox.getAttribute("data-userrole");

    if (userRole === "advance" || disbursedAt <= lastDateOfPreviousMonth) {
      checkbox.disabled = false;
    }

    checkbox.addEventListener("change", updateTotalAmount);
  });

  selectAllCheckbox.addEventListener("change", function () {
    const isChecked = selectAllCheckbox.checked;
    checkboxes.forEach((checkbox) => {
      if (!checkbox.disabled) {
        checkbox.checked = isChecked;
      }
    });
    updateTotalAmount();
  });

  generateInvoiceBtn.addEventListener("click", async () => {
    const normal = [];
    const advance = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const id = checkbox.getAttribute("data-id");
        const disbursedAt = new Date(checkbox.getAttribute("data-disbursedAt"));
        if (disbursedAt >= firstDateOfCurrentMonth) {
          advance.push(id);
        } else {
          normal.push(id);
        }
      }
    });
    console.log({ normal, advance });
    window.location.href = `/customer/generate-invoice/${normal.length ? normal : 'normal'}/${advance}`
  });
});