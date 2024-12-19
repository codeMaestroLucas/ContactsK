const { registerEmailOfMonth } = require("../../utils/emailsOfTheMonth");
const makeValidations = require("../../utils/makeValidations");
const Planilha = require("../Excel/Sheet");
const BaseSite = require("./BaseSite");
const Lawyer = require("../Lawyer");


class Site extends BaseSite{
  constructor(name, link, totalPages, maxLawyersForSite) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  /**
   * Function used to get the lawyers in the current page.
   * @returns {WebElement[]} array of all the lawyers in the current page
   */
  async getLawyersInPage() {}


  /**
   * Function used to get the Lawyer information from the site
   * @param {WebElement}
   */
  async getLawyer(lawyer) {}


  /**
   * Searches for lawyers across multiple web pages and registers them if they
   * meet validation criteria.
   *
   * This asynchronous function iterates through a specified number of pages to
   * find lawyers. It accesses each page, retrieves lawyer details, and performs
   * validation checks. Lawyers who pass the validation are registered.
   *
   */
  async *searchForLawyers() {
    for (let i = 0; i < this._totalPages; i++) {
      console.log(`${ this._totalPages }) ${ i } - - - - Page ${ i + 1 }`);

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

          let { isPartner, lawyerDetails } = yield lawyer;

          if (!isPartner) {
            console.log("Not Partner");
            continue; // Skip this lawyer
          }
  

          if ( !lawyerDetails || !lawyerDetails.country || !lawyerDetails.email ) {
            console.log(`Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }.\nSkipping...`);
            console.log("  Name: " + lawyerDetails.name);
            console.log("  Email: " + lawyerDetails.email);
            console.log("  Country: " + lawyerDetails.country);
            continue;
          }

          let { name = "", country, email } = lawyerDetails;

          if (email && !name) {
            name = this.getNameFromEmail(email);
          }

          let canRegister = makeValidations(
            name, country, email,
            this._lastCountries, this.emailsOfMonthPath, this.emailsToAvoidPath
          );
          if (!canRegister) continue;

          this.registerLawyer(
            name, country, email,
            this._name, this.emailsOfMonthPath
          );

          if (this._lawyersRegistered === this._maxLawyersForSite) {
            console.log(`No more than ${ this._maxLawyersForSite } lawyer need for the firm ${ this._name }.`);
            return;
          }

          yield ;

        } catch (e) {
          console.log(`Error reading ${ index + 1 }th lawyer at the page ${ i + 1 } of the firm ${ this._name }\nError: ${ e }...`);
          continue;

        } finally {
          yield ;
          
        }
      }
    }
  }


  /**
   * Function used to register a lawyer in the Sheet and in the file.txt
   * emailsOfMonth. Also it add the country of the lawyer to the set os countries
   * @param {string} name
   * @param {string} email
   * @param {string} firmName
   */
  registerLawyer(name, country, email, firmName, emailsOfMonthPath) {
    const planilha = new Planilha();

    email = email.toLowerCase()
      .replace("mailto:", "")
      .replace("mailto", "")
      .trim();

    planilha.addContact(
      new Lawyer(name, country, email).returnTreatData(firmName)
    );

    registerEmailOfMonth(email, emailsOfMonthPath);
    if (country !== "Not Found") {
      this._lastCountries.add(country);
    }

    this._lawyersRegistered++;
  }
}

module.exports = Site;
