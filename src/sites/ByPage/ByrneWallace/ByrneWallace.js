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

    let partners = [];
    for (let lawyer of lawyers) {
      const html = await lawyer
        .findElement(By.className("sol-category"))
        .getAttribute("outerHTML");
      const role = (this.getContentFromTag(html)).toLowerCase();
      if (role.includes("partner")) partners.push(lawyer);
    }

    return partners;
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
