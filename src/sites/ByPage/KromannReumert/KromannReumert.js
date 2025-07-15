const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KromannReumert extends ByPage {
  constructor(
    name = "Kromann Reumert",
    link = "https://kromannreumert.com/en/people?f%5B0%5D=category%3A51&page=0",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://kromannreumert.com/en/people?f%5B0%5D=category%3A51&page=${ index }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("group-content")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("field node-title"))
      .findElement(By.css("h2"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("field node-title"))
      .findElement(By.css("h2"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("field field-email"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("field field-phone"))
      .getText();
  }


  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: await this.#getPhone(lawyer),
      country: "Denmark",
    };
  }
}

module.exports = KromannReumert;
