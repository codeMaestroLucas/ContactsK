const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LexCaribbean extends ByNewPage {
  constructor(
    name = "Lex Caribbean",
    link = "https://lexcaribbean.com/attorneys/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("attorney-item")),
      100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (
        await lawyer
          .findElement(By.className("team-card__position"))
          .findElement(By.className("retreattag"))
          .getText()
      ).toLowerCase();
      if (role.includes("partner")) partners.push(lawyer);
    }

    return partners;
  }

  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className("team-card"))
      .getAttribute("href");

    await super.openNewTab(link);
  }

  async #getName() {
    return await driver
      .findElement(By.className("w-col w-col-9"))
      .findElement(By.className("hero__heading is-bold is-details"))
      .getText();
  }

  async #getEmail(ancors) {
    for (let a of ancors) {
      const href = await a.getAttribute("href");

      if (!href) continue;

      if (href.includes("mailto:")) return href;
    }
  }

  async getLawyer() {
    const div = await driver.wait(
      until.elementLocated(By.className("w-col w-col-3"))
    );
    const ancors = await div
      .findElement(By.className("team-details-card"))
      .findElement(By.className("team-details-card__red-box"))
      .findElement(By.className("team-details-card__red-box-text"))
      .findElements(By.css("a"));


    return {
      name: await this.#getName(),
      email: await this.#getEmail(ancors),
      country: "Caribe",
    };
  }
}

module.exports = LexCaribbean;
