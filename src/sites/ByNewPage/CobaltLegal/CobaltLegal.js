const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CobaltLegal extends ByNewPage {
  constructor(
    name = "Cobalt Legal",
    link = "https://www.cobalt.legal/experts/",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyersDiv = await driver.findElements(By.className("expert-list"));
    const partnersDiv = lawyersDiv[1];
    return await partnersDiv.findElements(By.className("expert-item"))
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("hero-info"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("block-body"))
      .findElement(By.className("expertinfo-email"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getDDD() {
    return await driver
      .findElement(By.className("block-body"))
      .findElement(By.className("expertinfo-phone"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: getCountryByDDD(await this.#getDDD()),
    };
  }

}

module.exports = CobaltLegal;
