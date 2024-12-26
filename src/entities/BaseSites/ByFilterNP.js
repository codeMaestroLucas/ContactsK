const ensureFileExists = require("../../utils/ensureFileExists");
const makeValidations = require("../../utils/makeValidations");
const ByNewPage = require("../../entities/BaseSites/ByNewPage");
let { driver } = require("../../config/driverConfig");


class ByFilterNP extends ByNewPage {
  constructor(name, link, totalPages, maxLawyersForSite) {
    super(name, link, totalPages, maxLawyersForSite);

    const sanitizedPath = name.trim().replace(/\s+/g, "");
    this.emailsOfMonthPath = `./src/sites/ByFilter/${ sanitizedPath }/${ sanitizedPath }.txt`;
    this.emailsToAvoidPath = `./src/sites/ByFilter/${ sanitizedPath }/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);
    
    this._filterOptions = {
      "": "",
      "": "",
    };

    this._currentCountry = "";
    this._usedCountries = new Set();
    // this._totalPages = new Set(Object.values(this._filterOptions)).size;
    // The set avoid that a Contry that have more than one city registred to be
    // called again
  }

  /**
   * Function used to get a random country based in the length of the filterOptions.
   *
   * Also sets the current country.
   */
  async selectRandomCountry() {
    const cityKeys = Object.keys(this._filterOptions);
    const availableCities = cityKeys.filter(
      city => !this._usedCountries.has(this._filterOptions[city])
    );

    if (availableCities.length === 0) {
      return "No more countries to search."
    }

    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    const selectedCountry = this._filterOptions[randomCity];

    this._usedCountries.add(selectedCountry);

    this._currentCountry = selectedCountry;
  }


  async searchForLawyers() {
    for (let i = 0; i < this._totalPages; i++) {
      console.log(`Page ${ i + 1 } - - - - - - - - - - ( ${ this._totalPages } )`);

      await this.accessPage(i);

      const awnser = await this.selectRandomCountry();
      if (awnser === "No more countries to search.") return;

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

          break; // Just one lawyer will be registred for that country.

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

module.exports = ByFilterNP;
