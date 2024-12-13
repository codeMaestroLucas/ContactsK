const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LEXLogmannsstofa extends ByPage {
  constructor(
    name = "LEX Logmannsstofa",
    link = "https://www.lex.is/en/hlutverk/eigendur-en/",
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
        By.className("team-item")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h4 strong"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("p > a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    const nameDiv = await lawyer.findElement(
      By.className("descr")
    );

    return {
      name: await this.#getName(nameDiv),
      email: await this.#getEmail(nameDiv),
      country: "Iceland",
    };
  }
}

module.exports = LEXLogmannsstofa;
