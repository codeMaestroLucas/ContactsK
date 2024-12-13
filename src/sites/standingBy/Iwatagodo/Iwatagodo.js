
const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Iwatagodo extends ByNewPage {
  constructor(
    name = "Iwatagodo",
    link = "https://www.iwatagodo.com/english/lawyers/index.html?position=partner",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    try {
      // await driver
      //   .findElement(By.className("cookie-consent-buttons"))
      //   .findElement(By.css("a:first-child"))
      //   .click();
      
      // await super.rollDown(1, 0.2);
    } catch (error) {}
  }

  async getLawyersInPage() {
    // Can't find the lawyers in page
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.css("ul.filter-target > li.partner")
      ), 100000
    );
    console.log(lawyers.length);
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const nameElement = await driver
      .findElement(By.className("name"))
      .getText();

    
    return nameElement
  }

  async #getEmail() {
    const emailElement = await driver
      .findElement(By.css("dl:last-child"))
      .findElement(By.css("dd"))
      .getText();

      if (emailElement.includes("@iwatagodo.com")) return emailElement;

    return null;  // Not all partners have an email
  }

  async getLawyer(lawyer) {
    await driver.wait(
      until.elementLocated(By.className("")
      ), 6000
    );
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Japan",
    };
  }

}

module.exports = Iwatagodo;

async function main() {
  t = new Iwatagodo();
  await t.searchForLawyers();
}

main();
