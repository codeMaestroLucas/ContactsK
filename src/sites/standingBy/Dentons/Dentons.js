const { getCountryByDDD } = require("../../../../utils/getNationality");
let { driver } = require("../../../../config/driverConfig");
const Site = require("../../Site");

const { until, By } = require("selenium-webdriver");

// FILTER
class Dentons extends Site {
  constructor(
    name = "Dentons",
    link = "https://www.dentons.com/en/our-professionals?Filters=%26sectorid%3D%26practiceid%3D%26positionid%3DE8CC721CPARTN%26languageid%3D%26inpid%3D%26countryid%3D%26page%3D1",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }

  async clickAdd() {
    try {
      const addBtn = await driver.wait(
        until.elementLocated(By.id("onetrust-accept-btn-handler")),
        8000
      );
      await addBtn.click();
    } catch (e) {
      // console.error("Didn't recognize the add button");
    }
  }

  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index);
    this.clickAdd();
  }

  /**
   * This function is used to return the links and the names of the lawyers
   * @returns {Array} of NAME and LINK
   */
  async getLawyersInPage() {
    const lawyersLink = await driver.wait(
      until.elementsLocated(By.className("name"))
    );
    const lawyers = [];
    
    for (let lawyer of lawyersLink) {
      let link = await lawyer.getAttribute("href");
      
      let nameElement = await lawyer.findElement(By.className('ng-binding'));

      let name = await nameElement.getText();
      
      if (link && name) {
        lawyers.push({ name, link });
      }

    }
    return lawyers;
  }

  // Just need to load more lawyers -> id: get-more

  async #openInNewTab(lawyerLink) {
    const originalWindow = await driver.getWindowHandle();
    await driver.switchTo().newWindow("tab");
    await driver.get(lawyerLink);
    this.clickAdd();
    return originalWindow;
  }


  async #getEmail() {
    const emailElement = await driver.findElement(
      By.className("cmn-lightbox no-js-reload force")
    );
    const email = await emailElement.getAttribute("rel");
    return email.replace("mailto:", "");
  }

  async #getDDD() {
    const dddElement = await driver.findElement(By.className("callToDevice"));
    const ddd = await dddElement.getAttribute("href");
    return ddd.replace("callto:+", "");
  }

  async getLawyer(lawyer) {
    const originalWindow = await this.#openInNewTab(lawyer.link);
    
    try {
      const name = lawyer.name;
      const email = await this.#getEmail();
      const ddd =  await this.#getDDD();
      const country = getCountryByDDD(ddd);

      return { name, email, country };

    } catch (error) {
      console.error("Error extracting lawyer details:", error.message);
      return null;

    } finally {
      await driver.close();
      await driver.switchTo().window(originalWindow);
    }
  }

  async searchForLawyers() {
    await super.searchForLawyers();
  }
}

module.exports = Dentons;

async function main() {
  const t = new Dentons();
  await t.searchForLawyers();
}

main();
