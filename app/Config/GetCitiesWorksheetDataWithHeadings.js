const ExcelJS = require('exceljs');
const requiredHeadings = ['city', 'pincode'];

function isRichValue(value) {
  return Boolean(value && Array.isArray(value.richText));
}

function richToString(rich) {
  const value = rich.richText.map(({ text }) => text).join('');
  return value;
}

module.exports.GetWorksheetDataWithHeadings = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(`${process.cwd()}/${filePath}`);
  const worksheet = workbook.getWorksheet(1);
  const headers = worksheet.getRow(1).values;

  const data = [];
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip the header row

    const rowData = {};

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (requiredHeadings.includes(header)) {
        if (isRichValue(cell.value)) {
          rowData[header] = richToString(cell.value, cell.text);
        } else {
          rowData[header] = cell.value;
        }
        if (isRichValue(cell.text)) {
          rowData[header] = richToString(cell.text, cell.text);
        } else {
          rowData[header] = cell.text;
        }
      }
    });
    data.push(rowData);
  });
  return data;
};
