const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LexCaribbean extends ByNewPage {
  constructor(
    name = "Lex Caribbean",
    link = "https://lexcaribbean.com/attorneys/",
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
      until.elementsLocated(By.className("attorney-item")),
      100000
    );

    const webRole = [
      By.className("team-card__position"),
      By.className("retreattag")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className("team-card"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("w-col w-col-9"))
      .findElement(By.className("hero__heading is-bold is-details"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("team-details-card"))
      .findElement(By.className("team-details-card__red-box"))
      .findElement(By.className("team-details-card__red-box-text"))
      .findElements(By.css("a"));
    return await super.getSocials(socials);
  }

  async getLawyer() {
    const div = await driver.wait(
      until.elementLocated(By.className("w-col w-col-3"))
    );

    const { email, phone } = await this.#getSocials(div);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Caribe"
    };
  }
}

module.exports = LexCaribbean;
