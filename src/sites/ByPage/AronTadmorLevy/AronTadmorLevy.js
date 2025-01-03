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


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("section-title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
        .findElement(By.className("person-contact align-self-end"))
        .findElement(By.className("email"))
        .findElement(By.className("val"))
        .findElement(By.className("fnt-bold"))
        .getText();
    const phone = await lawyer
        .findElement(By.className("person-contact align-self-end"))
        .findElement(By.className("phone"))
        .findElement(By.className("val"))
        .findElement(By.className("nounder fnt-regular"))
        .getText();

    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Israel",
    };
  }
}

module.exports = AronTadmorLevy;
