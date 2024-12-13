const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GianniAndOrigoni extends ByPage {
  constructor(
    name = "Gianni And Origoni",
    link = "https://www.gop.it/people.php?lang=eng",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    // Select partner option
    await driver.findElement(By.xpath('//*[@id="apriadvanceded"]/div[3]/select/option[3]')).click();
    await driver
      .findElement(By.className('campoform9'))
      .findElement(By.className('bottone_people'))
      .click();
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("tabella_risu")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .getAttribute("title");
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("campotab7"))
      .findElement(By.className("circlelink"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Italy",
    };
  }
}

module.exports = GianniAndOrigoni;
