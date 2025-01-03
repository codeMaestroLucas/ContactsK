const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CarneluttiLawFirm extends ByNewPage {
  constructor(
    name = "Carnelutti Law Firm",
    link = "https://www.carnelutti.com/people/",
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
        By.className("text-decoration-none")
      ), 100000
    );

    const webRole = [
      By.css("div"),
      By.className("c-333")
    ]
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.xpath('/html/body/div[2]/div[1]/div/p[1]/span[2]'))
      .getText();
  }

  async #getSocials() {
    const socials = await driver
      .findElement(By.className('modal-body'))
      .findElements(By.css('a'));
    return await super.getSocials(socials);
  }

  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Italy",
    };
  }
}

module.exports = CarneluttiLawFirm;
