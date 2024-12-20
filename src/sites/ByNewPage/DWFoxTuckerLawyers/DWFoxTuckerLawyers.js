const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DWFoxTuckerLawyers extends ByNewPage {
  constructor(
    name = "DW Fox Tucker Lawyers",
    link = "https://www.dwfoxtucker.com.au/our-people",
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
        By.css("div.staff-list.staff-full-list > a.staff")
      ), 100000
    );
    return lawyers.slice(0, 10);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("text"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("related staff-related"))
      .findElement(By.className("mail"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Australia",
    };
  }
}

module.exports = DWFoxTuckerLawyers;
