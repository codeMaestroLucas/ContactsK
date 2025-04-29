const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DittmarAndIndrenius extends ByPage {
  constructor(
    name = "Dittmar And Indrenius",
    link = "https://www.dittmar.fi/people/?type=partners",
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
      until.elementsLocated(By.className("person--data")),
      100000
    );
  }

  async #getName(lawyer) {
    return await lawyer.findElement(By.className("entry-title")).getText();
  }

  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElement(By.className("contact-row"))
      .findElements(By.css("ul > li > a"));
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const { email } = await this.#getEmail(lawyer);
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: "Finland",
    };
  }
}

module.exports = DittmarAndIndrenius;
