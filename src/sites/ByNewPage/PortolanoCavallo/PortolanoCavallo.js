const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class PortolanoCavallo extends ByNewPage {
  constructor(
    name = "Portolano Cavallo",
    link = "https://portolano.it/en/people",
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
        By.className("app-person-block-small app-has-link")
      ), 100000
    );

    const webRole = [
      By.className("app-text"),
      By.className("app-role")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
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
    return (await lawyer
      .findElement(By.className("app-contacts"))
      .findElement(By.className("app-email"))
      .findElement(By.css("a"))
      .getAttribute("href")
    ).replace("//", "");
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.css(".app-main-wrapper-cont:nth-child(3)"))
      .findElement(By.className("app-main-wrapper"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Italy",
    };
  }
}

module.exports = PortolanoCavallo;
