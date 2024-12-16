const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MZMLegal extends ByPage {
  constructor(
    name = "MZM Legal",
    link = "https://mzmlegal.com/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    try {
      const addBtn = await driver.wait(
        until.elementLocated(By.id("wt-cli-accept-all-btn")
      ), 2000
      );
      await addBtn.click();
    } catch (e) {}
  }

  async getLawyersInPage() {
    const allLawyers = await driver.wait(
      until.elementsLocated(
        By.className("d-flex g-0 flex-column rounded text-center teamItem")
      ), 60000
    );
    return allLawyers.slice(0, 12);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("teamItemName textGold text-uppercase"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("col-auto pb-4"))
      .findElement(By.css('a[href^="mailto:"]')) // Fixed CSS selector
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

module.exports = MZMLegal;
