const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HiggsAndJohnson extends ByNewPage {
  constructor(
    name = "Higgs And Johnson",
    link = "https://higgsjohnson.com/attorneys/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    let lawyers = await driver.wait(
      until.elementsLocated(
        By.className("row items persons people grid attorneys")
      ), 100000
    );
    lawyers = lawyers.slice(0, 2);

    let partners = [];
    for (let lawyer of lawyers) {
      partners.push(... await lawyer.findElements(By.className("prev-content__image")))
    }

    return partners;
  }


  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h1"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("meta person-details display-flex-block-wrap "))
      .findElements(By.css("div > a"));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("row banner-inner"))
      .findElement(By.className("banner-inner__left-text"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Jamaica",
    };
  }
}

module.exports = HiggsAndJohnson;
