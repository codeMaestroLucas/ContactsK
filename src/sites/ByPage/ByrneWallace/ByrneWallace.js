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


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.css(".sollistname > a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css(".sollistname > a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css("div.sol-detail"));

    let email = await socials[0]
      .findElement(By.css("a"))
      .getAttribute("href");
    let phone = await socials[1].getText();
    
    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Ireland"
    };
  }

}

module.exports = ByrneWallace;
