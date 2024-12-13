const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MeitarLawOffices extends ByPage {
  constructor(
    name = "Meitar Law Offices",
    link = "https://meitar.com/en/people/?cat_people=partner&lang=en",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
    this.rollDown(6, 1.5)
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("people-post-content order-3 order-md-1")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("people-post-content-title"))
      .findElement(By.css("h3"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("people-post-content-contact"))
      .findElement(By.css("li:nth-of-type(2) > a"))
      .getText();
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Israel"
    };
  }
}

module.exports = MeitarLawOffices;
