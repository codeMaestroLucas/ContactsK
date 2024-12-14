const { processFirm, constructFirms } = require("./constructLawFirms");
const { makeReport} = require('./makeReport')
const Sheet = require("../entities/Excel/Sheet");
const { getRandomNumber } = require("./interfaceUt");
const { driver } = require("../config/driverConfig");
const Reports = require("../entities/Excel/Reports");

async function getRandomLawFirm() {
  const timeInit = performance.now();

  const reportsFile = new Reports();
  reportsFile.eraseLastReport();

  const sheet = new Sheet();
  sheet.eraseLastSheet();
  const emptyRowsStart = sheet.rowsToFill;
  sheet.fillEmptyColumns();

  const lawFirms = await Promise.all(constructFirms());
  const lawFirmsLen = lawFirms.length;

  if (!lawFirms || lawFirms.length === 0) {
    console.log("No law firms found. Please verify the input or configuration.");
    driver.quit();
    return;
  }

  const indexsOfProcessedFirms = new Set();

  try {
    while (sheet.rowsToFill > 0) {
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
        await processFirm(firmToSearch, originalIndex, indexsOfProcessedFirms, reportsFile);

      } catch (error) {
        console.log("Failed to process the firm " + firmToSearch.name);
        // throw error;
      }
    }

    // After finishing all the rows, log the result
    if (sheet.countEmptyRows() === 0) {
      console.log("All the empty rows were filled. Stopping the search process...");
    } else {
      console.log("All firms have been processed.");
    }

  } catch (error) {
    console.error("Processing encountered an error:", error);

  } finally {
    driver.quit();

    const planilha = new Sheet();
    const emptyRowsFinal = planilha.countEmptyRows();

    const timeEnd = performance.now();

    makeReport(emptyRowsStart, emptyRowsFinal, timeInit, timeEnd, lawFirmsLen);
  }
}


module.exports = getRandomLawFirm;
