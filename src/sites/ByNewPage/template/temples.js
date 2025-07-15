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
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css(""))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.className())
      .findElements(By.className())
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = Template;

async function main() {
  t = new Template();
  // await t.accessPage(0);
  await t.searchForLawyers();
}

main();
