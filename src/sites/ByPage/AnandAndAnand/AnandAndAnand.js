const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class AnandAndAnand extends ByPage {
  constructor(
    name = "Anand And Anand",
    link = "https://www.anandandanand.com/our-team/",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `https://www.anandandanand.com/our-team/page/${index + 1}/`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("attorney-info card-body card__background col-12")),
      100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("title"))
      .findElement(By.className("h5"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("contacts"))
      .findElements(By.css("a"));
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const { email } = await this.#getSocials(lawyer);
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: "India",
    };
  }
}

module.exports = AnandAndAnand;
