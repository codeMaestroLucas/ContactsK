const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GittiAndPartnersLawFirm extends ByNewPage {
  constructor(
    name = "Gitti And Partners Law Firm",
    link = "https://www.grplex.com/en/the-lawyers",
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
        By.css("div.people-row > div.listingx2:first-child > ul.nav.double > li")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.css("h2"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("info-contact"))
      .findElement(By.css("p:first-child > a"))
      .getAttribute("href")
  }


  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: "+39 02 7217091",
      country: "Italy"
    };
  }
}

module.exports = GittiAndPartnersLawFirm;
