const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ClemensLaw extends ByPage {
  constructor(
    name = "Clemens Law",
    link = "https://clemenslaw.dk/en/medarbejdere/",
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
        By.className("text employee__meta")
      ), 100000
    );

    const webRole = [
      By.className("employee__title")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("employee__name"))
      .getAttribute("href");
  }



  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("employee__name"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.className('employee__email'))
      .getAttribute("href");

    const phone = await lawyer
      .findElement(By.className('employee__phone'))
      .getAttribute("href");
  
    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Poland",
    };
  }

}

module.exports = ClemensLaw;
