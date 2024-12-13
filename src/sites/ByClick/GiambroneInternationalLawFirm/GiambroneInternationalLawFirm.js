const { getCountryByDDD } = require("../../../utils/getNationality");
const ByClicking = require("../../../entities/BaseSites/ByClicking");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GiambroneInternationalLawFirm extends ByPage {
  constructor(
    name = "Giambrone International Law Firm",
    link = "https://www.giambronelaw.com/site/people/senior-lawyers/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  /**
   * https://www.giambronelaw.com/site/people/senior-lawyers/
   * https://www.giambronelaw.com/site/people/senior-lawyers/
   */

  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(until.elementsLocated(By.className("")));
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

module.exports = GiambroneInternationalLawFirm;

async function main() {
  t = new GiambroneInternationalLawFirm();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
