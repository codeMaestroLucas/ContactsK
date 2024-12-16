const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MishconKaras extends ByNewPage {
  constructor(
    name = "Mishcon Karas",
    link = "https://www.mishconkaras.com.hk/people",
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
      until.elementsLocated(
        By.className("card_person__col")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.css("a"))
        .findElement(By.className("card-person__subheading"))
        .getAttribute("outerHTML")
      ).toLowerCase();

      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.id("sh-herTtl"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.id("ctl00_ctl00_MainPlaceHolder_AsidePlaceHolder_ctl00_dvContactInfo"))
      .findElement(By.className("col-12 col-xs-12"))
      .findElement(By.css("ul > li:last-child > a"))
      .getAttribute("href");
  }


  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Hong Kong",
    };
  }
}

module.exports = MishconKaras;

async function main() {
  t = new MishconKaras();
  await t.searchForLawyers();
}

main();
