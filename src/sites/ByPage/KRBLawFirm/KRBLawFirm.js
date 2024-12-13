const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KRBLawFirm extends ByPage {
  constructor(
    name = "KRB Law Firm",
    link = "https://www.krblawfirm.com/?todo=staff&lang=en",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    await driver.wait(until.elementsLocated(By.className("row")));

    const staffContainer = await driver
      .findElement(By.id("staff-div"))
      .findElement(By.className("container max-width-none"));

    const lawyers = await staffContainer.findElements(By.className("text-center"));

    const roleRegex = /Partner/i;

    let partners = [];
    for (let lawyer of lawyers) {
      const roleText = await lawyer
        .findElement(By.css("div:nth-of-type(2)"))
        .findElement(By.className("font-size-22px"))
        .getText();

      if (roleRegex.test(roleText)) partners.push(lawyer);
    }

    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("div:nth-of-type(1)"))
      .findElement(By.className("font-weight-bold font-size-28px"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("div:nth-of-type(3)"))
      .findElement(By.className("font-size-22px"))
      .getText();
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Israel",
    };
  }
}

module.exports = KRBLawFirm;
