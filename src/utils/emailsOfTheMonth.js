const fs = require("fs");

/**
 * @returns Month & Year as named arguments
 */
function getMonthAndYear() {
  const now = new Date();
  return {
      currentMonth: now.getMonth() + 1,
      // Adding 1 to make it 1-based (1 = January, 2 = February, etc.)
      currentYear: now.getFullYear()
  };
}


/**
 * @param {string} email captured in the Sheet
 * @param {string} month that the email was captured in the Sheet
 * @param {string} year that the email was captured in the Sheet
 * @returns {string} formatted string
 */
function generateStringToFile(email, month, year) {
  const emptySpaces = 70 - email.length;
  return `${email}${" ".repeat(emptySpaces)}${month}/${year}\n`;
}


/**
 * Function used to register the email of the month in the file
 * ${firmName}/${firmName}.txt.
 * @param {string} email - treated before - to be registered.
 */
function registerEmailOfMonth(email, emailFilePath) {
  const { currentMonth, currentYear } = getMonthAndYear();

  fs.appendFileSync(
    emailFilePath,
    generateStringToFile(email, currentMonth, currentYear),
    "utf8"
  );
}

/**
 * Function used to GET the emails that were registered in the file for the
 * current month.
 * @param {string} email - to check.
 * @returns {boolean} - returns true if the email is found for the current
 * month, false otherwise.
 */
function getRegisteredEmailOfMonth(email, emailFilePath) {
  try {
    const fileContent = fs.readFileSync(emailFilePath, "utf8");
    return fileContent.includes(email);

  } catch (err) {
    console.error("Error reading file", err);
    return false;
  }
}

module.exports = { registerEmailOfMonth, getRegisteredEmailOfMonth };
