const xlsx = require("xlsx");

class Excel {
  constructor(filePath) {
    this.filePath = filePath;
    this.workbook = xlsx.readFile(filePath);
    this.ws = this.workbook.Sheets[this.workbook.SheetNames[0]];
    this._rowsToFill = 50;
  }

  // Getter for rowsToFill
  get rowsToFill() {
    return this._rowsToFill;
  }

  // Setter for rowsToFill
  set rowsToFill(valueToDecrease) {
    this._rowsToFill -= valueToDecrease;
  }

  /**
     * Function used to get the WorkSheet as an Array of Arrays
     * @returns the workSheet
     *
     * [
            ['Name', 'Age', 'City'],

            ['John', 25, 'NY'],

            ['Alice', 30, 'LA']

        ]
     */
  getWorksheet() {
    return xlsx.utils.sheet_to_json(this.ws, { header: 1 });
  }

  /**
   * Getter for the Worksheet
   * @returns the worksheet one
   */
  ws() {
    return this.ws;
  }

  getFilePath() {
    return this.filePath;
  }

  saveSheet() {
    xlsx.writeFile(this.workbook, this.filePath);
  }
}

module.exports = Excel;
