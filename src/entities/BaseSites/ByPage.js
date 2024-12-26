const ensureFileExists = require("../../utils/ensureFileExists");
const makeValidations = require("../../utils/makeValidations");
const Lawyer = require("../Lawyer");
const Site = require("./Site")


class ByPage extends Site {
  constructor(name, link, totalPages, maxLawyersForSite) {

    super(name, link, totalPages, maxLawyersForSite);

    const sanitizedPath = name.trim().replace(/\s+/g, "");
    this.emailsOfMonthPath = `./src/sites/ByPage/${ sanitizedPath }/${ sanitizedPath }.txt`;
    this.emailsToAvoidPath = `./src/sites/ByPage/${ sanitizedPath }/emailsToAvoid.txt`;

    ensureFileExists(this.emailsOfMonthPath);
    ensureFileExists(this.emailsToAvoidPath);
  }
  

  async searchForLawyers() {
    for (let i = 0 ; i < this._totalPages ; i++) {
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
          const lawyerDetails = await this.getLawyer(lawyer);
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

          let canRegister =  makeValidations(
            lawyerToRegister,
            this._lastCountries,
            this.emailsOfMonthPath, this.emailsToAvoidPath
          );
          if (!canRegister) continue;

          this.registerLawyer(lawyerToRegister, this.emailsOfMonthPath);

          if (this._lawyersRegistered === this._maxLawyersForSite) {
            console.log(
              `No more than ${ this._maxLawyersForSite } lawyer need for the firm ${ this._name }.`
            );
            return;
          }

        } catch (e) {
          console.log(
            `Error reading ${ index  + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nError: ${ e }...`
          );
          continue;
          // throw e;
        }
      }
    }
  }
}

module.exports = ByPage;
