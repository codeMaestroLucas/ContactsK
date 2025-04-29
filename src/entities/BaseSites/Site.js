const { registerEmailOfMonth } = require("../../utils/emailsOfTheMonth");
const Sheet = require("../Excel/Sheet");
const BaseSite = require("./BaseSite");
const Lawyer = require("../Lawyer");


class Site extends BaseSite {
  constructor(name, link, totalPages, maxLawyersForSite) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  /**
   * Function used to get the lawyers in the current page.
   * @returns {WebElement[]} array of all the lawyers in the current page
   */
  async getLawyersInPage() {}

  /**
   * Retrieves email and phone information from social link elements.
   * @param {WebElement[]} socialLinks - Array of web elements containing social links
   * @param {boolean} [getPhone=false] - Flag to determine if phone should be collected
   * @returns {Object} An object containing email and phone (if found and requested)
   */
  async getSocials(socialLinks, getPhone = false) {
    let email = null;
    let phone = null;


    for (const link of socialLinks) {
      try {
        const href = await link.getAttribute('href');
        if (!href) continue;

        const normalizedHref = href.toLowerCase().trim();

        if (normalizedHref.includes('mailto') && !email) {
          email = normalizedHref;
          if (!getPhone && email) break; // Exit early if we only need email
          
        } else if (getPhone && normalizedHref.includes('tel') && !phone) {
          phone = normalizedHref;
        }

        // Exit early if we've found everything we need
        if (email && (!getPhone || phone)) break;
      } catch (error) {
        console.error('Error processing social link:', error);
      }
    }

    return { email, phone };
  }

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
   * @param {Lawyer} lawyer to be registered
   */
  registerLawyer(lawyer, emailsOfMonthPath) {
    const planilha = new Sheet();

    const { name, email, firm, country } = lawyer;

    planilha.addContact(name, email, firm, country);

    registerEmailOfMonth(email, emailsOfMonthPath);
    if (country !== "Not Found") {
      this._lastCountries.add(country);
    }

    this._lawyersRegistered++;
  }
}

module.exports = Site;
