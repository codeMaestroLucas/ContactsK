const { getCountryByDDD } = require("../../../utils/getNationality");

const ByClicking = require("../../../entities/BaseSites/ByClicking");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Template extends ByClicking {
  constructor(
    name = "Template",
    link = "https://www.example.com/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  /**
   * 
   */

  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    console.log(lawyers.length);
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""))

    
    return nameElement
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className(""))


    return emailElement
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className(""))
      
    return dddElement
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = Template;

async function main() {
  t = new Template();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
