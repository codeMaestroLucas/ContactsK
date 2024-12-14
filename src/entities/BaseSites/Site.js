const { registerEmailOfMonth } = require("../../utils/emailsOfTheMonth");
const { driver } = require("../../config/driverConfig");
const Planilha = require("../Excel/Sheet");
const Lawyer = require("../Lawyer");

const { By, Key } = require("selenium-webdriver");


class Site {
  constructor(name, link, totalPages, maxLawyersForSite = 1) {
    this._name = name;
    this._link = link;
    this._totalPages = totalPages;
    this._maxLawyersForSite = maxLawyersForSite;
    this._lastCountries = new Set();
    this._lawyersRegistered = 0;
  }

  get name() {
    return this._name
  }

  get lawyersRegistered() {
    return this._lawyersRegistered
  }

/**
 * Waits for the current page to fully load by checking the `document.readyState`.
 *
 * This method uses the WebDriver's `wait` function to repeatedly evaluate the
 * `document.readyState` property until it is `'complete'`, indicating that the
 * page has fully loaded. The maximum wait time is 60 seconds.
 *
 * @async
 * @returns {Promise<void>} Resolves once the page has fully loaded or the
 * timeout is reached.
 *
 * @throws {Error} If the page does not load within the 60-second timeout.
 *
 */
  async waitForPageToLoad() {
    await driver.wait(async function() {
      const readyState = await driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 60000); // Waits up to 60 seconds for the page to be fully loaded
  }
  

  /**
   * Function used to switch the pages in the site.
   * @param {number} index of the current iteration
   * @param {string} otherUrl to be switched. This URL contains the index inside
   *  of it so it iterates through the index.
   */
  async accessPage(index, otherUrl= "") {
    const url = index === 0 ? this._link : otherUrl;
    await driver.get(url);
    await this.waitForPageToLoad();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  }

  /**
   * Function used to get the lawyers in the current page
   */
  async getLawyersInPage() {}

  /**
   * Function used to roll down the page so more lawyers can be found
   * @param {number} timesToRollDown
   * @param {number} sleepTime in seconds
   */
  async rollDown(timesToRollDown, sleepTime) {
    for (let c = 0; c < timesToRollDown; c++) {
      await new Promise((resolve) => setTimeout(resolve, (sleepTime * 1000)));
      const actions = driver.actions();
      await actions
        .keyDown(Key.CONTROL)
        .sendKeys(Key.END)
        .keyUp(Key.CONTROL)
        .perform();
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  /**
   * Function to get the Job Function of an Lawyer and return if it's a Partner
   * or not.
   * @param {*} lawyer object
   * @param {string} classPath for the object
   * @returns {boolean} true if it's a Partner else false
   */
  async isPartner(lawyer, classPath) {
    const role = (await lawyer.findElement(
        By.className(classPath)).getText()).trim().toLowerCase();
    return role.includes("partner");
  }

  /**
   * Function used to get the Lawyer information from the site
   */
  async getLawyer(lawyer) {}

  /**
   * Searches for lawyers across multiple web pages and registers them if they meet validation criteria.
   *
   * This asynchronous function iterates through a specified number of pages to find lawyers. It accesses each page,
   * retrieves lawyer details, and performs validation checks. Lawyers who pass the validation are registered.
   *
   * The function stops searching if it finds 5 lawyers from the same country or if a page has no lawyers listed.
   *
   * @param {number} numberOfIterations - The number of pages to iterate over and search for lawyers.
   *
   */
  async searchForLawyers() {}


  /**
   * Function that uses a regex to extract just the content of an HTML tag
   */
  getContentFromTag(tag) {
    const regex = />([^<>]+)</;

    const match = tag.match(regex);
    return match ? match[1] : null;
  }


  /**
   * Function used to extract the name from the Email address if the name wasn't
   * found.
   *
   * The name will be identified with "*****" to further analisys
   *
   * @param {string} email.
   * @return {string} name from the extracted email.
   */
  getNameFromEmail(email) {
    const emailRegex = /^([\w.-]+)@/;
    const match = email.replace("mailto:", "")
                  replace("mailto", "")
                  .toLowerCase()
                  .trim()
                  .match(emailRegex);
    let name = "";
  
    if (match) {
      name = match[1].replace(/-/g, ' ').split('.').join(' ').trim();
    }

    // To identify that the name was made with this function
    return name + " *****";
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
