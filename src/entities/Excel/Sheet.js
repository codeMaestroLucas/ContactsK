const Excel = require("./Excel");

const xlsx = require("xlsx");


class Sheet extends Excel {
  constructor(filePath = "src/baseFiles/excel/Sheet.xlsx") {
    super(filePath);
    this._lastCountry = null;
    this._lastFirm = null;
    this._rowsFilled = new Set();
  }

  get rowsToFill() {
    return this._rowsToFill;
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

    for (let row = 2; row <= this._rowsToFill + 2; row++) {

      workSheet[`A${ row }`] = { v: "" };
      workSheet[`B${ row }`] = { v: "" };
      workSheet[`C${ row }`] = { v: "" };
      workSheet[`D${ row }`] = { v: "" };
      workSheet[`E${ row }`] = { v: "" };
      workSheet[`F${ row }`] = { v: "" };
      workSheet[`G${ row }`] = { v: "" };

      this.saveSheet();
    }
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
      this._rowsToFill --;
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

      for (let row = 2; row <= this._rowsToFill + 2; row++) {
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
