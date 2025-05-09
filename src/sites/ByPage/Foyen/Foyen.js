const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Foyen extends ByPage {
  constructor(
    name = "Foyen",
    link = "https://foyen.no/en/people/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    await driver
      .findElement(
        By.xpath(
          '//*[@id="top"]/section[2]/div/div[1]/form[2]/span[1]/select/option[4]'
        )
      )
      .click();
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("mix all grid rg-15 partner")),
      100000
    );
  }


  async #getName(lawyer) {
    return await lawyer.findElement(By.css("h2")).getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css("a"));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const { email } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: "Norway",
    };
  }
}

module.exports = Foyen;
