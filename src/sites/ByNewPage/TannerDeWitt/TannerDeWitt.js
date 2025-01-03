const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class TannerDeWitt extends ByNewPage {
  constructor(
    name = "Tanner DeWitt",
    link = "https://www.tannerdewitt.com/our-people/",
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
        By.css("ul.people-list > li")
      ), 100000
    );

    const webRole = [
      By.css("span > em")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("page-title lt"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.id("profile-email"))
      .getAttribute("href");
  }


  async #getPhone() {
    return await driver.findElement(By.className("section-lawyer")).getText()
  }

  
  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: await this.#getPhone(),
      country: "Hong Kong"
    };
  }
}

module.exports = TannerDeWitt;
