const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class TannerDeWitt extends ByNewPage {
  constructor(
    name = "Tanner DeWitt",
    link = "https://www.tannerdewitt.com/our-people/",
    totalPages = 1,
    maxLawyersForSite = 100
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

  let partners = [];
  for (let lawyer of lawyers) {
    const role = (await lawyer
        .findElement(By.css("span > em"))
        .getText()
      ).toLowerCase();
    if (role.includes("partner")) partners.push(lawyer);
    
  }

    return partners;
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

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Hong Kong",
    };
  }
}

module.exports = TannerDeWitt;
