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


  async #getSocials() {
    const socials = await driver
      .findElements(By.className("contact-info__link"))
    return await super.getSocials(socials);
  }

  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Bulgaria",
    };
  }
}

module.exports = DGKV;
