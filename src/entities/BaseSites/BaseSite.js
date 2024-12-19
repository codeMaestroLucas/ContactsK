const { driver } = require("../../config/driverConfig");

const { By, Key } = require("selenium-webdriver");


/**
 * Abstract Class used to define the base site attributes and operations that
 * will be used to register a lawyer.
 */
class BaseSite {
  /**
   * @param {string} name
   * @param {string} link
   * @param {number} totalPages
   * @param {number} maxLawyersForSite
   */
  constructor(name, link, totalPages, maxLawyersForSite = 1) {
    this._name = name;
    this._link = link;
    this._totalPages = totalPages;
    this._maxLawyersForSite = maxLawyersForSite;
    this._lastCountries = new Set();
    this._lawyersRegistered = 0;
  }


  get name() {
    return this._name;
  }


  get lawyersRegistered() {
    return this._lawyersRegistered;
  }


  /**
   * Waits for the current page to fully load by checking the `document.readyState`.
   *
   * This method uses the WebDriver's `wait` function to repeatedly evaluate the
   * `document.readyState` property until it is `'complete'`, indicating that the
   * page has fully loaded. The maximum wait time is 3min.
   *
   * @async
   * @returns {Promise<void>} Resolves once the page has fully loaded or the
   * timeout is reached.
   *
   * @throws {Error} If the page does not load within the 60-second timeout.
   *
   */
  async waitForPageToLoad() {
    await driver.wait(async function () {
      const readyState = await driver.executeScript(
        "return document.readyState"
      );
      return readyState === "complete";
    }, 180000); // Waits up to 3min for the page to be fully loaded
  }

  
  /**
   * Function used to switch the pages in the site.
   * @param {number} index of the current iteration
   * @param {string} otherUrl to be switched. This URL contains the index inside
   *  of it so it iterates through the index.
   */
  async accessPage(index, otherUrl = "") {
    const url = index === 0 ? this._link : otherUrl;
    await driver.get(url);
    await this.waitForPageToLoad();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
  }


  /**
   * Function used to roll down the page so more lawyers can be found
   * @param {number} timesToRollDown
   * @param {number} sleepTime in seconds
   */
  async rollDown(timesToRollDown, sleepTime) {
    for (let c = 0; c < timesToRollDown; c++) {
      await new Promise((resolve) => setTimeout(resolve, sleepTime * 1000));

      const actions = driver.actions();
      await actions.keyDown(Key.CONTROL)
                   .sendKeys(Key.END)
                   .keyUp(Key.CONTROL)
                   .perform();
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }


  /**
   * Filters lawyers from the provided list based on their role, returning only partners.
   *
   * @param {WebElement[]} lawyersInPage - Array of WebElements representing lawyers on the page.
   * @param {By[]} webRole - Array of locators for the role element within a lawyer element.
   * @param {boolean} byText - If true, uses `getText()`; otherwise, uses `getAttribute('outerHTML')`. Default is true.
   * @returns {Promise<WebElement[]>} Array of WebElements representing partners.
   */
  async filterPartnersInPage(lawyersInPage, webRole, byText = true) {
    let partners = [];

    for (let lawyer of lawyersInPage) {
      // Starts with lawyer to overwrite further on with the locators
      let element = lawyer;

      for (const locator of webRole) {
        element = await element.findElement(locator);
      }

      const role = byText
        ? (await element.getText()).toLowerCase().trim()
        : (await element.getAttribute("outerHTML")).toLowerCase().trim();

      if (role.includes("partner")) partners.push(lawyer);
    }

    return partners;
  }


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
    // Regex to extract the part before '@'
    const emailRegex = /^([\w.-]+)@/;
    let name = "";

    try {
      const sanitizedEmail = email.replace(/mailto:/i, "").trim().toLowerCase();
      const match = sanitizedEmail.match(emailRegex);

      if (match) {
        name = match[1].replace(/-/g, " ").split(".").join(" ").trim();

      } else {
        throw new Error("Invalid email format or no match found.");
      }

    } catch (error) {
      const fallbackMatch = email
                                 .replace(/mailto:/i, "")
                                 .trim()
                                 .toLowerCase()
                                 .match(/^([^@]+)/);
      if (fallbackMatch) {
        name = fallbackMatch[1].replace(/-/g, " ").split(".").join(" ").trim();
      }
    }

    // To identify that the name was generated from this function
    return name + " *****";
  }
}

module.exports = BaseSite;
