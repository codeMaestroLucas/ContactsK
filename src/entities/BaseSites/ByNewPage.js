const ensureFileExists = require("../../utils/ensureFileExists");
const makeValidations = require("../../utils/makeValidations");
let { driver } = require("../../config/driverConfig");
const Lawyer = require("../Lawyer");
const Site = require("./Site");

const { until, By } = require("selenium-webdriver");


class ByNewPage extends Site {
  constructor(name, link, totalPages, maxLawyersForSite) {
    super(name, link, totalPages, maxLawyersForSite);

    const sanitizedPath = name.trim().replace(/\s+/g, "");
    this.emailsOfMonthPath = `./src/sites/ByNewPage/${ sanitizedPath }/${ sanitizedPath }.txt`;
    this.emailsToAvoidPath = `./src/sites/ByNewPage/${ sanitizedPath }/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);
  }


  /**
   * Function used to open a new page and switch to it for getting the lawyer data
   *
   * If the link is an empty string that lawyer will be ignored
   * @param {string} link - The URL to be opened in a new tab
   */
  async openNewTab(link) {
    if (link.trim() === "" || !link) {
      return;
    };

    // Open a new tab and navigate to the link
    await driver.switchTo().newWindow('tab');
    await driver.get(link);
  
    await this.waitForPageToLoad();
  
    // Switch to the newly opened tab
    //* This make possible for the driver interact with the new window
    const windows = await driver.getAllWindowHandles();
    await driver.switchTo().window(windows[windows.length - 1]);
    await driver.wait(until.elementLocated(By.css("body")), 5000);
  }


  /**
   * Function used to close the current tab
   */
  async closeTab() {
    // Get all window handles before closing the tab
    const windows = await driver.getAllWindowHandles();
    try {
      // Close the current tab
      await driver.close();

      // After closing, switch to the last opened tab (or any other tab you need)
      await driver.switchTo().window(windows[windows.length - 2]);
      
    } catch (error) {
      await driver.switchTo().window(windows[windows.length - 1]);
    }
  }


  async searchForLawyers() {
    for (let i = 0; i < this._totalPages; i++) {
      console.log(`Page ${ i + 1 } - - - - - - - - - - ( ${ this._totalPages } )`);

      await this.accessPage(i);

      const lawyersInPage = await this.getLawyersInPage();

      if (!lawyersInPage || lawyersInPage.length <= 0) {
        console.log(
          `No search results found on page ${ i + 1 } of the firm ${ this._name }`
        );
        continue; // Skip this page
      }

      for (let [index, lawyer] of lawyersInPage.entries()) {
        try {
          await this.openNewTab(lawyer);
          const windows = await driver.getAllWindowHandles();
          if (windows.length < 2) continue ;

          
          const lawyerDetails = await this.getLawyer();
          if (lawyerDetails === "Not Partner") {
            console.log("Not Partner");
            continue;
          }
      
          if (!lawyerDetails || !lawyerDetails.link || !lawyerDetails.email) {
            console.log(
              `Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nSkipping...`
            );
            console.log("  Link: " + lawyerDetails.link);
            console.log("  Name: " + lawyerDetails.name);
            console.log("  Email: " + lawyerDetails.email);
            console.log("  Phone: " + lawyerDetails.phone);
            console.log("  Country: " + lawyerDetails.country);
            continue;
          }

          let { link, name = "", email, phone, country } = lawyerDetails;

          if (email && !name) {
            name = this.getNameFromEmail(email);
          }

          const lawyerToRegister = new Lawyer(link, name, email, phone, this._name, country);

          let canRegister = makeValidations(
            lawyerToRegister,
            this._lastCountries,
            this.emailsOfMonthPath, this.emailsToAvoidPath
          );
          if (!canRegister) continue;

          this.registerLawyer(lawyerToRegister, this.emailsOfMonthPath);


          if (this._lawyersRegistered === this._maxLawyersForSite) {
            console.log(`No more than ${ this._maxLawyersForSite } lawyer need for the firm ${ this._name }.`);
            return;
          }
        } catch (e) {
          console.log(`Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }\nError: ${ e }...`);
          continue;
          // throw e;
        } finally {
          const windows = await driver.getAllWindowHandles();
          if (windows.length > 1) await this.closeTab();
        }
      }
    }
  }
}

module.exports = ByNewPage;
