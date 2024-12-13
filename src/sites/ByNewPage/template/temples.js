const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Template extends ByNewPage {
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

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className(""))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getEmail() {
    const emailElement = await driver
      .findElement(By.className(""))
      .getAttribute("href");


    return emailElement
  }


  async #getDDD() {
    const dddElement = await driver
      .findElement(By.className(""))
      .getAttribute("href");
      
    return dddElement
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: getCountryByDDD(await this.#getDDD()),
    };
  }
}

module.exports = Template;

async function main() {
  t = new Template();
  await t.accessPage(0);
  // await t.searchForLawyers();
}

main();
