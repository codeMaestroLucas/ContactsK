const Excel = require("./Excel");

const xlsx = require("xlsx");


class Sheet extends Excel {
  constructor(filePath = "src/baseFiles/excel/Sheet.xlsx") {
    super(filePath);
    this._lastCountry = null;
    this._lastFirm = null;
    this._rowsFilled = new Set();
  }


  /**
   * Function used to Set & Get a random number in the range of [ 2 - 52 ]
   * @returns {number} random number
    */
  setGetNewRowNumber() {
    const MIN = 2;
    const MAX = this.rowsToFill + MIN;
  
    const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
    const availableRows = [];
  
    for (let i = MIN; i <= MAX; i++) {
      if (!this._rowsFilled.has(i) && !workSheet[`B${ i }`]?.v) {
        availableRows.push(i);
      }
    }
  
    if (availableRows.length === 0) {
      return null; // No available rows
    }
  
    // Randomly pick one of the available rows
    const randomIndex = Math.floor(Math.random() * availableRows.length);
    const selectedRow = availableRows[randomIndex];
    this._rowsFilled.add(selectedRow);
  
    return selectedRow;
  }
  
  
  /**
   * @param {str} newCountry to be setted
   */
  set lastCountry(newCountry) {
    this._lastCountry = newCountry;
  }

  /**
   * @param {str} newFirm to be setted
   */
  set lastFirm(newFirm) {
    this._lastFirm = newFirm;
  }


  saveSheet() {
    xlsx.writeFile(this.workbook, this.filePath);
  }

  
  /**
   * Erases all data from the specified rows in the Excel sheet.
   *
   * This function iterates through the rows of an Excel sheet, starting from
   * the second row (skipping the header row), and clears the content of all
   * cells in each row.
   *
   * @param {number} rowsToErase - The total number of rows to erase.
   * Defaults to this._rowsToFill value.
   */
  eraseLastSheet() {
    const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];

    for (let i = 2; i <= this.rowsToFill + 2; i++) {
      workSheet[ `A${ i }` ] = { v: undefined };
      workSheet[ `B${ i }` ] = { v: undefined };
      workSheet[ `C${ i }` ] = { v: undefined };
      workSheet[ `D${ i }` ] = { v: undefined };
      workSheet[ `E${ i }` ] = { v: undefined };
      workSheet[ `F${ i }` ] = { v: undefined };
      workSheet[ `G${ i }` ] = { v: undefined };
    }

    this.saveSheet();
  }
  
  
  
  addContact(link, name, email, phone, firm, country) {
    if (this._lastCountry === country && this._lastFirm === firm) {
      console.log(
        `The firm ${ this._lastFirm } already has a lawyer in the country ${ this._lastCountry } registered in the sheet.`
      );
      return;
    }

    const i = this.setGetNewRowNumber();
    if (i === null) {
      return;
    }


    try {
      const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];

      workSheet[ `A${ i }` ] = { v: link };
      workSheet[ `B${ i }` ] = { v: name };
      workSheet[ `C${ i }` ] = { v: email };
      workSheet[ `D${ i }` ] = { v: phone };
      workSheet[ `E${ i }` ] = { v: firm };
      // workSheet[ `F${ i }` ] = { v: practiceArea };
      workSheet[ `G${ i }` ] = { v: country };

      this.saveSheet();
      console.log("Contact added successfully.");

      this.lastCountry = country;
      this.lastFirm = firm;
    } catch (err) {
      console.error("Error while adding contact:", err);
    }
  }


  /**
   * Counts the number of empty rows in the Excel sheet.
   *
   * This function iterates through the rows of an Excel sheet, starting from
   * the second row (skipping the header row). It checks if all cells in a row
   * are empty (i.e., undefined, null, or empty string) and decrements the count
   * of empty rows if a row is not empty.
   *
   * @param {number} rowsToFill - The total number of rows to check.
   * Defaults is this._rowsToFill value.
   * @returns {number} - The number of empty rows remaining after checking the
   * specified number of rows.
   */
  countEmptyRows() {
    let emptyRowsLeft = this.rowsToFill;
  
    // Iterate from row 2 to rowsToFill + 2 (accounting for header row)
    for (let row = 2; row <= this.rowsToFill + 2; row++) {
      const currentRow = this.ws[`B${row}`];
  
      // Check if column B (index 1) is empty
      const isEmpty =
        !currentRow || // Cell doesn't exist
        !currentRow.v || // Cell value is undefined/null
        currentRow.v === ""; // Cell is an empty string
  
      if (!isEmpty) {
        emptyRowsLeft--;
      }
    }
  
    return emptyRowsLeft;
  }
  

}

module.exports = Sheet;
