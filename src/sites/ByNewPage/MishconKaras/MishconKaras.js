const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MishconKaras extends ByNewPage {
  constructor(
    name = "Mishcon Karas",
    link = "https://www.mishconkaras.com.hk/people",
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
        By.className("card_person__col")
      ), 100000
    );

    const webRole = [
      By.css("a"),
      By.className("card-person__subheading")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.id("sh-herTtl"))
      .getText();
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.id("ctl00_ctl00_MainPlaceHolder_AsidePlaceHolder_ctl00_dvContactInfo"))
      .findElement(By.className("col-12 col-xs-12"))
      .findElements(By.css("ul > li > a"));
    return await super.getSocials(socials);
  }


  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email.replace("?cc=marketing@gornitzky.com", ""),
      phone: phone,
      country: "Hong Kong",
    };
  }
}

module.exports = MishconKaras;
