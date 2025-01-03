const Excel = require("./Excel");
const xlsx = require("xlsx");

class Reports extends Excel {
  constructor(filePath = "src/baseFiles/excel/Reports.xlsx", reportRows = 50) {
    super(filePath);
    this._lastRow = 2;
    this.reportRows = reportRows;
  }

  eraseLastReport() {
    for (let row = 1; row < this.reportRows + 2; row++) {
      for (let col = 0; col < 3; col++) {
        const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
        const cell = this.ws[cellAddress];

        if (cell) {
          cell.v = "";
        }
      }
    }
    this.saveSheet();
  }

  generateIndiviualReport(firmName, duration, totalLawyersRegistered) {
    const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
    const i = this._lastRow;

    workSheet[`A${ i }`] = { v: firmName };
    workSheet[`B${ i }`] = { v: duration };
    workSheet[`C${ i }`] = { v: totalLawyersRegistered };

    this.saveSheet();
    this._lastRow++;
  }
}

module.exports = Reports;
