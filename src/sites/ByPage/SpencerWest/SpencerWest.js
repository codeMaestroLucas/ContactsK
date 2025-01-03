const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { By, until } = require('selenium-webdriver');


class SpencerWest extends ByPage {
  constructor(
    name = "Spencer West",
    link = "https://www.spencer-west.com/team/",
    totalPages = 21  // Has 23 pages but the last Partner is on 21 Page
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherLink = `${ this._link }page/${ index + 1 }`
    await super.accessPage(index, otherLink);
  }

 
  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("person-card__content")),
      20000
    );
    
    const webRole = [
      By.className("person-card__job-description"),
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("person-card__name"))
      .getAttribute("href");
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.className("social-link"));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await lawyer.findElement(By.className("person-card__name")).getText(),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = SpencerWest;
