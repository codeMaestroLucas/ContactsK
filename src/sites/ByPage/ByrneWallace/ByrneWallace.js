const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ByrneWallace extends ByPage {
  constructor(
    name = "Byrne Wallace",
    link = "https://www.byrnewallace.com/about-us/our-team/",
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
        By.className("col-md-4")
      ), 100000
    );

    const webRole = [
      By.className("sol-category")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css(".sollistname > a"))
      .getText();
  }

  async #getEmail(lawyer) {
    const socials = await lawyer.findElements(
      By.css(".sol-detail > a")
    );
    
    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Ireland"
    };
  }

}

module.exports = ByrneWallace;
