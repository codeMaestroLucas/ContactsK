const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ALMTLegal extends ByPage {
  constructor(
    name = "ALMT Legal",
    link = "https://almtlegal.com/mumbai-partner.php",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `https://almtlegal.com/bangalore-partner.php`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("profile_box")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
        .findElement(By.css("h1"))
        .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
        .findElement(By.css("h3 a[href*='mailto:']"))
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

module.exports = ALMTLegal;
