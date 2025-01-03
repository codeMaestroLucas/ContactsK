const { generateIndividualReport } = require("./makeReport");
const { header } = require("./interfaceUt");

const ByClickFirms = require("../sites/ByClick/completed");
const ByFilterFirms = require("../sites/ByFilter/completed");
const ByNewPageFirms = require("../sites/ByNewPage/completed");
const ByPageFirms = require("../sites/ByPage/completed");

const path = require("path");

/**
 * Dynamically loads a law firm class from the file system.
 *
 * @param {string} firmName - The name of the law firm.
 * @param {string} folderName - The folder where the firm's files are located.
 * @returns {Promise<Object>} A Promise resolving to an instance of the loaded
 * law firm class.
 * @throws {Error} If the file for the law firm cannot be found or loaded.
 */
async function loadLawFirm(firmName, folderName) {
  const filePath = path.resolve(
    __dirname,
    `../sites/${ folderName }/${ firmName }/${ firmName }`
  );
  const LawFirmClass = require(filePath);
  return new LawFirmClass();
}

/**
 * Executes an asynchronous operation with retry logic.
 *
 * @param {Function} operation - An asynchronous function representing the
 * operation to perform.
 * @param {number} [retries=2] - The number of retry attempts allowed before
 * throwing an error.
 * @returns {Promise<any>} A Promise resolving to the result of the operation,
 * or rejecting if all retries fail.
 * @throws {Error} The last error encountered if the operation fails after all
 * retry attempts.
 */
async function withRetry(operation, retries = 1) {
  let attempts = 0;

  while (attempts <= retries) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      if (attempts > retries) throw error;
    }
  }
}

/**
 * Processes a law firm by performing operations such as setting headers and
 * invoking its search functionality.
 *
 * @param {Object} firm - The law firm object to be processed.
 * @param {number} index - The index of the law firm in the array.
 * @param {Set<number>} processedFirms - A set tracking the indices of firms
 * that have been successfully processed.
 * @returns {number} The quantity of lawyers that have been registred for that
 * firm.
 * @throws {Error} If the firm's search operation fails after retries.
 */
async function processFirm(firm, firmIndex, processedFirms, reportsFile) {
  if (firmIndex === -1) return;

  const timeInit = performance.now();
  header(firm.name);

  await withRetry(async () => {
    processedFirms.add(firmIndex);
    await firm.searchForLawyers();
  });
  
  console.log("=".repeat(100) + "\n\n");
  const timeEnd = performance.now();
  generateIndividualReport(firm.name, timeInit, timeEnd, firm.lawyersRegistered, reportsFile);

  return firm.lawyersRegistered;
}

/**
 * Constructs an array of law firm objects based on the given configuration.
 * @returns {Array<Object>} An array of law firm objects.
 */
function constructFirms() {
  const categories = [
    { firms: ByClickFirms,   folder: "ByClick"   },
    { firms: ByFilterFirms,  folder: "ByFilter"  },
    { firms: ByNewPageFirms, folder: "ByNewPage" },
    { firms: ByPageFirms,    folder: "ByPage"    },
  ];

  const allFirms = [];

  categories.forEach(({ firms, folder }) => {

    const firmNames = Array.isArray(firms)
      ? firms // Directly use the array if it's not an object
      : Object.values(firms || {}) // Flatten values if it's an object
          .flat() // Combine all arrays into one
          .filter((firmName) => firmName && firmName.trim() !== ""); // Remove invalid names

    firmNames.forEach((firmName) => {
      allFirms.push(loadLawFirm(firmName, folder));
    });
  });

  return allFirms;
}

module.exports = { processFirm, constructFirms };
