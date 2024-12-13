const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HiggsAndJohnson extends ByPage {
  constructor(
    name = "Higgs And Johnson",
    link = "https://higgsjohnson.com/attorneys/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    let lawyers = await driver.wait(
      until.elementsLocated(
        By.className("row items persons people grid attorneys")
      ), 100000
    );
    lawyers = lawyers.slice(0, 2);

    let partners = [];
    for (let lawyer of lawyers) {
      partners.push(... await lawyer.findElements(By.className("prev-content__meta")))
    }

    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("title"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("description"))
      .findElement(By.css("a"))
      .getAttribute("href")
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Jamaica",
    };
  }

}

module.exports = HiggsAndJohnson;
