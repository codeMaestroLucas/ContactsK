const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HavelPartners extends ByPage {
  constructor(
    name = "Havel Partners",
    link = "https://www.havelpartners.com/team/?_position=partners",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `https://www.havelpartners.com/team/?_position=partners&_page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("ct-div-block center--all flipbox box-shadow--m")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("ct-code-block width--full center--all"))
      .findElement(By.className("text--uppercase pad--xs text--m text--primary"))
      .getText();
  }

  async #getEmail(lawyer) {
    const contactsElement = await lawyer
      .findElement(By.className("ct-div-block"))
      .findElements(By.className("ct-link"));
    
    for (let contact of contactsElement) {
      const href = await contact.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  async getLawyer(lawyer) {
    const divName = await lawyer.findElement(
      By.className("ct-div-block flipbox__front bg--white")
    );
    const dataName = await lawyer.findElement(
      By.className("ct-div-block flipbox__back center--all bg--secondary pad--s")
    );

    return {
      name: await this.#getName(divName),
      email: await this.#getEmail(dataName),
      country: "Czech Republic"
    };
  }
}

module.exports = HavelPartners;
