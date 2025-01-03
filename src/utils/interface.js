const { processFirm, constructFirms } = require("./constructLawFirms");
const { getRandomNumber } = require("./interfaceUt");
const { driver } = require("../config/driverConfig");
const Reports = require("../entities/Excel/Reports");
const Sheet = require("../entities/Excel/Sheet");
const { makeReport } = require('./makeReport');

async function getRandomLawFirm() {
  const timeInit = performance.now();
  
  const sheet = new Sheet();
  sheet.eraseLastSheet();
  const emptyRowsStart = sheet.rowsToFill;
  
  const lawFirms = await Promise.all(constructFirms());
  const lawFirmsLen = lawFirms.length;

  const reportsFile = new Reports({ reportsRow : lawFirmsLen});
  reportsFile.eraseLastReport();

  if (!lawFirms || lawFirms.length === 0) {
    console.log("No law firms found. Please verify the input or configuration.");
    driver.quit();
    return;
  }

  const indexsOfProcessedFirms = new Set();

  let iteration = emptyRowsStart;
  try {
    while (iteration >= 0) {
      // Filter out firms that have already been processed
      var firms = lawFirms.filter(
        (_, index) => !indexsOfProcessedFirms.has(index)
      );
      // If no firms left to process, break the loop
      if (firms.length === 0) break;

      const randomIndex = await getRandomNumber(firms.length);
      const firmToSearch = firms[randomIndex];
      const originalIndex = lawFirms.indexOf(firmToSearch);

      try {
        iteration -= await processFirm(firmToSearch, originalIndex, indexsOfProcessedFirms, reportsFile);

      } catch (error) {
        console.log("Failed to process the firm " + firmToSearch.name);
        // throw error;
      }
    }

    // After finishing all the rows, log the result
    if (sheet.rowsToFill === 0) {
      console.log("All the empty rows were filled. Stopping the search process...");
      
    } else {
      console.log("All firms have been processed.");
    }

  } catch (error) {
    console.error("Processing encountered an error:", error);

  } finally {
    driver.quit();

    const emptyRowsFinal = sheet.rowsToFill - iteration;

    const timeEnd = performance.now();

    makeReport(emptyRowsStart, emptyRowsFinal, timeInit, timeEnd, lawFirmsLen);
  }
}


module.exports = getRandomLawFirm;
