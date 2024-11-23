module.exports.ValidateImport = (sheetData, ValidationRequest) => {
  for (const [index, array] of sheetData.entries()) {
    const { error, value } = ValidationRequest.validate(array);
    if (error) {
      throw new Error(
        `Error on line ${index + 1}: ${error.details[0].message}`
      );
    }
  }
};
