const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MeyerKöring extends ByNewPage {
  constructor(
    name = "Meyer Köring",
    link = "https://www.meyer-koering.de/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    await super.rollDown(4, 0.5);
  }


  async getLawyersInPage() {
    const div = await driver.wait(
      until.elementLocated(
        By.className("row anwaelte__row")
      ), 100000
    );

    let lawyers = await div
        .findElements(By.css("div.card a.card-img-overlay.d-flex.flex-column.justify-content-between"));
    let partners  = [];
    for (let lawyer of lawyers) {
        try {
            const role = (await lawyer
              .findElement(By.className("anwalt__position"))
              .getAttribute("outerHTML")
            ).toLowerCase();
      
            if (role.includes("partner")) partners.push(lawyer);
        } catch (error) {}
    }

    return partners;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("name"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.xpath('/html/body/main/section/div[1]/div[2]/div/div[1]/address/a'))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("col-md-6 d-flex col__cv"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Denmark",
    };
  }
}

module.exports = MeyerKöring;
