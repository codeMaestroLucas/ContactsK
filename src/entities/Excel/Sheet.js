const Excel = require("./Excel");

const xlsx = require("xlsx");


class Sheet extends Excel {
  constructor(filePath = "src/baseFiles/excel/Sheet.xlsx", _rowsToFill = 50) {
    super(filePath);
    this._lastCountry = null;
    this._lastFirm = null;
    this._rowsToFill = _rowsToFill;
    this._rowsFilled = new Set();
    
  }

  /**
   * Function used to Set & Get a random number in the range of [ 2 - 52 ]
   * @returns {number} random number
    */
  setGetNewRowNumber() {
    const MIN = 2;
    const MAX = this._rowsToFill + MIN;
  
    const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
    const availableRows = [];
  
    for (let i = MIN; i <= MAX; i++) {
      if (!this._rowsFilled.has(i) && !workSheet[`B${i}`]?.v) {
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
  countEmptyRows(rowsToFill = this._rowsToFill) {
    let emptyRowsLeft = rowsToFill;
  
    // Iterate from row 2 to rowsToFill + 1 (accounting for header row)
    for (let row = 2; row <= rowsToFill + 1; row++) {
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
  

  addContact({ firstName, nameTreated, firmNameTreated, countryTreated, emailTreated }) {
    if (this._lastCountry === countryTreated && this._lastFirm === firmNameTreated) {
      console.log(
        `The firm ${this._lastFirm} already has a lawyer in the country ${this._lastCountry} registered in the sheet.`
      );
      return;
    }

    const i = this.setGetNewRowNumber();
    if (i === null) {
      return;
    }


    try {
      const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];

      workSheet[ `A${i}` ] = { v: firstName };
      workSheet[ `B${i}` ] = { v: nameTreated };
      workSheet[ `C${i}` ] = { v: firmNameTreated };
      workSheet[ `D${i}` ] = { v: countryTreated };
      workSheet[ `G${i}` ] = { v: emailTreated };

      this.saveSheet();
      console.log("Contact added successfully.");

      this.lastCountry = countryTreated;
      this.lastFirm = firmNameTreated;
    } catch (err) {
      console.error("Error while adding contact:", err);
    }
  }


  /**
   * Function used to fill the Empty rows of the columns A and E of the Sheet.
   *
   * - The Column A will be filled with: =PROPER(IFERROR(LEFT(BX,FIND(" ",BX)-1),BX))
   *
   * - The Column E will be filled with: =IFERROR(VLOOKUP(DX, P5:Q260, 2, FALSE), "Not Found")
   *
   * The X is refering to the actual row.
   */
  fillEmptyColumns() {
    try {
      const workSheet = this.workbook.Sheets[this.workbook.SheetNames[0]];

      for (let row = 2; row <= this._rowsToFill + 1; row++) {
        const colB = workSheet[`B${row}`]?.v;

        if (!colB) {
          workSheet[`A${row}`] = {
            t: "s",
            v: `=PROPER(IFERROR(LEFT(B${row},FIND(" ",B${row})-1),B${row}))`,
          };
        }

        workSheet[`E${row}`] = {
          t: "s",
          v: `=IFERROR(VLOOKUP(D${row},P2:Q260,2,FALSE),"Not Found")`,
        };
      }

      this.saveSheet();
    } catch (err) {
      console.error("Error while filling empty columns:", err);
    }
  }
}

module.exports = Sheet;
