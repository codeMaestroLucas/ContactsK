const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GianniAndOrigoni extends ByPage {
  constructor(
    name = "Gianni And Origoni",
    link = "https://www.gop.it/people.php?lang=eng",
    totalPages = 1,
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    // Click to load all the lawyers - it takes a while to load all the lawyers
    await driver
      .findElement(By.className("campoform9"))
      .findElement(By.className("bottone_people"))
      .click();
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("tabella_risu")),
      100000
    );
    const webRole =[
      By.className("campotab2"),
    ]
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  async #getName(lawyer) {
    return await lawyer.findElement(By.css("a")).getAttribute("title");
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("campotab7"))
      .findElement(By.className("circlelink"))
      .getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Italy",
    };
  }
}

module.exports = GianniAndOrigoni;
