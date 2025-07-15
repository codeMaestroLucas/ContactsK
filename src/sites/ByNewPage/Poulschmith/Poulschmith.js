const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Poulschmith extends ByNewPage {
  constructor(
    name = "Poulschmith",
    link = "https://poulschmith.com/people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    await driver
      .findElement(By.id(`CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll`))
      .click();

    await driver
      .findElement(By.xpath(`/html/body/main/div/astro-island/div[2]/select[1]/option[2]`))
      .click();
      
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const loadMoreBtn = await driver.findElement(By.className('button button--block mb-3 mx-auto d-block'));

    for (let i = 0; i < 4; i++) {
      const actions = driver.actions();
      //! The hover prevents the click from the block
      await actions.move({ origin: loadMoreBtn }).perform();

      await new Promise(resolve => setTimeout(resolve, 300));

      await loadMoreBtn.click();

      await super.rollDown(1, 2);
    }
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("employee-card__link")
      ), 100000
    );
  }

  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }

  async #getName() {
    return await driver
      .findElement(By.className("hero__title"))
      .getText();
  }

  async #getSocials() {
    const socials = await driver
      .findElement(By.className("contact-info"))
      .findElements(By.className("contact-info__link"))
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Denmark"
    };
  }
}

module.exports = Poulschmith;
