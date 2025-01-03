const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Template extends ByPage {
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


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className(""))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className(""))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className())
      .findElements(By.className())
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = Template;

async function main() {
  t = new Template();
  // t.accessPage(0);
  t.searchForLawyers();
}

main();
