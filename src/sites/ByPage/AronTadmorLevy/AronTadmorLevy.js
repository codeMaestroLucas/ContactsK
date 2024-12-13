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
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("person h-100")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = await lawyer
          .findElement(By.css("a"))
          .findElement(By.className("person-info"))
          .findElement(By.className("thm-title position-title"))
          .getText();

      if (role.toLowerCase().includes("partner")) partners.push(lawyer);
    }

    return partners;
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
