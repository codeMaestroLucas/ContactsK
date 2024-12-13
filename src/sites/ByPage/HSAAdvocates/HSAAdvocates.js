const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HSAAdvocates extends ByPage {
  constructor(
    name = "HSA Advocates",
    link = "https://hsalegal.com/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    const partnerFilter = await driver.wait(
      until.elementsLocated(By.className("nav-link"))
    );
    await partnerFilter[2].click();
    new Promise(resolve => setTimeout(resolve, 4000));
  }

  async getLawyersInPage() {
    return await driver.wait(until.elementsLocated(By.className("team-item")));
  }

  async #getName(lawyer) {
    return (await lawyer
      .findElement(By.className("mb-0"))
      .getText())
      .trim();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css(".item-social.email a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }
}

module.exports = HSAAdvocates;
