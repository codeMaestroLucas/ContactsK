const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DBHLawyers extends ByNewPage {
  constructor(
    name = "DBH Lawyers",
    link = "https://www.dbh.com.au/team/",
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
        By.className("member__link")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("member-detail"))
      .findElement(By.className("member__head"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.className("section__body"))
      .findElement(By.className("row"))
      .findElement(By.css("div.col-12.col-md-6:last-child"))
      .findElements(By.className("d-inline-flex"))
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Australia",
    };
  }
}

module.exports = DBHLawyers;
