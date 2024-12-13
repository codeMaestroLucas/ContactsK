const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class FoxAndMandal extends ByPage {
  constructor(
    name = "Fox And Mandal",
    link = "https://foxandmandal.co.in/our-team/?title=&designation=partner",
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
        By.className("team-card-info")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h5"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css(".team-card-bottom > ul > li:nth-of-type(2) > span"))
      .getText();
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }
}

module.exports = FoxAndMandal;
