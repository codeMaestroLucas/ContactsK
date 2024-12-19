const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class AronTadmorLevy extends ByPage {
  constructor(
    name = "Aron Tadmor Levy",
    link = "https://arnontl.com/people/",
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
        By.className("person h-100")
      ), 100000
    );

    const webRole = [
      By.css("a"),
      By.className("person-info"),
      By.className("thm-title position-title")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("section-title"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
        .findElement(By.className("person-contact align-self-end"))
        .findElement(By.className("email"))
        .findElement(By.className("val"))
        .findElement(By.className("fnt-bold"))
        .getText();
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Israel",
    };
  }

}

module.exports = AronTadmorLevy;
