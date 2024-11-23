const detail = document.getElementById('ifsc-detail');

let bankName = $('#bank-name').val()
let stateName = $('#state-name').val()
let cityName = $('#city-name').val()
let branchName = $('#branch-name').val()


function slugify(str, addExtraNumber = false) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}


$('#bank-name').on('change', function () {
    bankName = $('#bank-name').val()
    window.location.href = `/ifsc-check/${slugify(bankName)}`
});

$('#state-name').on('change', function () {
    stateName = $(this).val()
    window.location.href = `/ifsc-check/${slugify(bankName)}/${slugify(stateName)}`
});

$('#city-name').on('change', function () {
    cityName = $(this).val()
    window.location.href = `/ifsc-check/${slugify(bankName)}/${slugify(stateName)}/${slugify(cityName)}`
});

$('#branch-name').on('change', function () {
    branchName = $(this).val()
    window.location.href = `/ifsc-check/${slugify(bankName)}/${slugify(stateName)}/${slugify(cityName)}/${slugify(branchName)}`
});
