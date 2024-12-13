const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ZeposAndYannopoulos extends ByNewPage {
  constructor(
    name = "Zepos And Yannopoulos",
    // link = "https://www.zeya.com/our-people", // In the 1st page page all the lawyers were already added
    link = "https://www.zeya.com/our-people?page=1",
    totalPages = 11,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `https://www.zeya.com/our-people?page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("card person-card")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("person-position"))
        .getText()
        ).toLowerCase();

      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className("has-text-centered"))
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("page-title"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("card person-card match-height"))
      .findElement(By.className("email"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Greece",
    };
  }

}

module.exports = ZeposAndYannopoulos;
