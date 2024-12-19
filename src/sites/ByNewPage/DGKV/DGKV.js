const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DGKV extends ByNewPage {
  constructor(
    name = "DGKV",
    link = "https://dgkv.com/lawyers?first_name=&last_name=&position=1&practice_area=&industry=&language=#results",
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
        By.className("team-member team-member--alt")
      ), 100000
    );
    // Remove just the 3rd element
    return lawyers.slice(0, 2).concat(lawyers.slice(3));
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("page-header__title "))
      .getText();
  }


  async #getEmail() {
    const contacts = await driver
      .findElements(By.className("contact-info__link"))
    
    for (let contact of contacts) {
      const href = await contact.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Bulgaria",
    };
  }

}

module.exports = DGKV;
