const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Chiomenti extends ByNewPage {
  constructor(
    name = "Chiomenti",
    link = "https://www.chiomenti.net/en/professionals/our-professionals/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);

      await driver
        .findElement(By.id("CybotCookiebotDialogBodyButtonAccept"))
        .click();
    } else {
      let button = await driver.findElement(By.className("practitioners-list-show-more-button"));
      await driver.wait(until.elementIsVisible(button), 5000);
      await driver.wait(until.elementIsEnabled(button), 5000);
      await button.click();
      
    }
    await super.rollDown(2, 0.5);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css(""))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className(""))
      .getText();

    
    return nameElement
  }


  async #getEmail() {
    const emailElement = await driver
      .findElement(By.className(""))
      .getAttribute("href");


    return emailElement
  }


  async #getDDD() {
    const dddElement = await driver
      .findElement(By.className(""))
      .getAttribute("href");
      
    return dddElement
  }

  
  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: getCountryByDDD(await this.#getDDD()),
    };
  }
}

module.exports = Chiomenti;

async function main() {
  t = new Chiomenti();
  await t.accessPage(0);
  await t.accessPage(1);
  await t.accessPage(2);
  // await t.searchForLawyers();
}

main();
