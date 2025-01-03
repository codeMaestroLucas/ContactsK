const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Kvale extends ByNewPage {
  constructor(
    name = "Kvale",
    link = "https://www.kvale.no/en/our-team/?position=1",
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
      until.elementsLocated(
        By.className("people__group__list__item__link")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("person__header__content__name"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('person__header__content__info'))
      .findElements(By.className('person__header__content__info__item__link'))
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className('person__header__content'));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Norway"
    };
  }
}

module.exports = Kvale;
