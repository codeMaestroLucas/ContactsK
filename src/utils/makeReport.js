const { header } = require("./interfaceUt");


/**
 * Calculates the total number of lawyers registered by subtracting the final
 * number of empty rows from the initial number of empty rows.
 *
 * @param {number} initialEmptyRows - The initial number of empty rows before registration.
 * @param {number} finalEmptyRows - The final number of empty rows after registration.
 * @returns {number} The total number of lawyers registered.
 *
 * @example
 * const total = totalLawyersRegistered(10, 3); // Returns 7
 */
function totalLawyersRegistered(initialEmptyRows, finalEmptyRows) {
  return initialEmptyRows - finalEmptyRows;
}


/**
 * Calculates the duration of an operation and formats it as a string
 * in minutes and seconds.
 *
 * @param {number} timeInit - The start time of the operation in milliseconds since the UNIX epoch.
 * @param {number} timeEnd - The end time of the operation in milliseconds since the UNIX epoch.
 * @returns {string} The formatted duration in minutes and seconds (e.g., "45sec", "3min 25sec").
 *
 */
function operationTime(timeInit, timeEnd) {
  const operationTimeInMs = timeEnd - timeInit;
  const operationTimeInSeconds = operationTimeInMs / 1000; // Convert milliseconds to seconds

  const minutes = Math.floor(operationTimeInSeconds / 60);
  const seconds = (operationTimeInSeconds % 60).toFixed(0);

  let stringToReturn;
  if (minutes === 0) {
    stringToReturn = `${seconds}sec`;
  } else {
    stringToReturn = `${minutes}min ${seconds}sec`;
  }

  return stringToReturn;
}


/**
 * Function used to insert the firm performance data into the file "Reports.xlsx".
 *  The report contains the name, duration and quantity of lawyers registered of
 * an firm.
 * @param {string} firmName
 * @param {number} timeInit
 * @param {number} timeEnd
 */
function generateIndividualReport(firmName, timeInit, timeEnd, totalLawyersRegistered, reportsFile) {
  const duration = operationTime(timeInit, timeEnd);
  reportsFile.generateIndiviualReport(firmName, duration, totalLawyersRegistered);
}



/**
 * Function used to print the data of the operation. It print's the duration of
 * the search operation and the total of lawyers registred.
 * @param {number} initialEmptyRows number
 * @param {number} finalEmptyRows number
 * @param {number} timeInit
 * @param {number} timeEnd
 */
function makeReport(initialEmptyRows, finalEmptyRows, timeInit, timeEnd, lawFirmsLen) {
  header("DATA", "-");

  console.log("Total number of firms registered: " + lawFirmsLen);

  const lawyersRegistered = totalLawyersRegistered(initialEmptyRows, finalEmptyRows);
  console.log("Lawyers registered: " + lawyersRegistered);

  const duration = operationTime(timeInit, timeEnd);
  console.log("Search duration: " + duration);

  console.log('\nCheck the file "Reports.xlsx" for individual reports on the firm`s search performance.');

  console.log("-".repeat(100));
}


module.exports = { generateIndividualReport, makeReport };
