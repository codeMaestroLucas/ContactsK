const { registerEmailOfMonth } = require("../../utils/emailsOfTheMonth");
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
   * validation checks.
   *
   * Lawyers who pass the validation are registered.
   *
   */
  async searchForLawyers() {}


  /**
   * Function used to register a lawyer in the Sheet and in the file.txt
   * emailsOfMonth. Also it add the country of the lawyer to the set os countries
   * @param {string} name
   * @param {string} country
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
