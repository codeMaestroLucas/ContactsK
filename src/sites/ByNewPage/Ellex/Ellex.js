const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Ellex extends ByNewPage {
  constructor(
    name = "Ellex",
    link = "https://ellex.legal/lawyers/?position=92",
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
        By.className("person-item  experts__item")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("person-item__content"))
        .findElement(By.className("person-item__info"))
        .getText()
      ).toLowerCase();

      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("expert-hero__name"))
      .getText();
  }


  async #getEmail() {
    const html = await driver
      .findElement(By.className("expert-hero__contact-info"))
      .getAttribute("outerHTML");

    const htmlEmail = html.split('<span style="unicode-bidi:bidi-override;direction:rtl;">')
    let email = htmlEmail[1].split("</span>")[0].trim();

    // Invert string
    return email.split('').reverse().join('');
  }


  async #getDDD() {
    return await driver
      .findElement(By.className("expert-hero__contact-info"))
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

module.exports = Ellex;
