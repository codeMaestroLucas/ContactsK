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
    await super.accessPage(index, `${ this._link }page/${ index + 1 }`);
  }

 
  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("person-card__wrapper")),
      20000
    );
  }

  /**
   * Function used to get the Email & DDD from the socialLink HTML bar
   * @param {*} socialLinks Element HTML
   * @returns the valid values for email & ddd or null if they don't exist
   */
  async #getSocialMidia(socialLinks) {
    let email;
    let ddd;

    for (let c = 0 ; c < socialLinks.length ; c++) {
        const href = (await socialLinks[c].getAttribute('href')).toLowerCase().trim();

        if (href.includes("mailto:")) {
          email = href;

        } else if (href.includes("tel:")) {
          ddd = href;
        }

    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const isPartner = this.isPartner(lawyer, "person-card__job-description");
    if (!isPartner) return "Not Partner";

    const socialLinks = await lawyer.findElements({ className: "social-link" });
    const { ddd, email } = await this.#getSocialMidia(socialLinks);

    return {
      name: await lawyer.findElement(By.className("person-card__name")).getText(),
      email: email,
      country: getCountryByDDD(ddd)
    };

  }
}

module.exports = SpencerWest;
