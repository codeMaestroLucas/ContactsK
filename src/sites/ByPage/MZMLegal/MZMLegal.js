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
      ), 5000
      );
      await addBtn.click();
    } catch (e) {}
  }

  async getLawyersInPage() {
    const allLawyers = await driver.wait(until.elementsLocated(
      By.className("d-flex g-0 flex-column rounded text-center teamItem"))
    );
    return allLawyers.slice(0, 12);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css(".col.py-4.position-relative h2"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("div > a[href^='mailto:']"))
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
