const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Krogerus extends ByPage {
  constructor(
    name = "Krogerus",
    link = "https://www.krogerus.com/people?position=partners",
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
        By.className("md:px-3 xl:px-4 w-full md:w-1/2 lg:w-1/4 mb-6 md:mb-8 overflow-hidden people-card-outer text-base")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("mb-1 md:mb-2"))
      .findElement(By.css("a"))
      .getText();
  }

  
  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("mb-1 md:mb-2 ellipsis"))
      .findElement(By.className("border-b border-transparent hover:border-black transition"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Finland"
    };
  }
}

module.exports = Krogerus;
