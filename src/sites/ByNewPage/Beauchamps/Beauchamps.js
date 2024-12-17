const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Beauchamps extends ByNewPage {
  constructor(
    name = "Beauchamps",
    link = "https://www.beauchamps.ie/our-people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  
    await driver
      .findElement(By.id('CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'))
      .click();
  
    await driver
      .findElement(By.xpath('/html/body/div/div[2]/div[2]/form/div[4]/div/select/option[9]'))
      .click();

    await new Promise(resolve => setTimeout(resolve, 500));
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("column medium-8 large-6 people-grid__item")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("green-card__contact"))
      .findElement(By.css("li:last-child > a"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("green-card__inner"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Ireland",
    };
  }
}

module.exports = Beauchamps;
