const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class SEUMLaw extends ByPage {
  constructor(
    name = "SEUMLaw",
    link = "https://www.seumlaw.com/professionals",
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
        By.className("lawyer-card")
      ), 100000
    );

    const webRole = [
      By.className("lawyer-card__info-basic"),
      By.className("info-basic__position")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer.getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("lawyer-card__info-basic"))
      .findElement(By.className("info-basic__name"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.className("lawyer-card__info-email"))
      .getText();

    const phone = await lawyer
      .findElement(By.className("lawyer-card__info-tel"))
      .getText();
    return { email, phone };
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Korea (South)"
    };
  }
}

module.exports = SEUMLaw;
