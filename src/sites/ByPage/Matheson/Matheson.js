const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Matheson extends ByPage {
  constructor(
    name = "Matheson",
    link = "https://www.matheson.com/people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("info-box")
      ),60000
    );
  }


  async #getLink(lawyer) {
    return lawyer
     .findElement(By.className("highlighted-box"))
     .findElement(By.css("a"))
     .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("highlighted-box"))
      .findElement(By.className("title"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("email"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("contact"))
      .getText();
  }


  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: await this.#getPhone(lawyer),
      country: "Ireland"
    };
  }
}

module.exports = Matheson;
