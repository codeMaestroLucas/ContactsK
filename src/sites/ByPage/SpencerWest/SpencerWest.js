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
      until.elementsLocated(By.className("person-card__wrapper")),
      20000
    );
    
    const webRole = [
      By.className("person-card__job-description"),
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getSocials(lawyer) {
    let email;
    let ddd;

    const socials = await lawyer.findElements(By.className("social-link"));

    for (let social of socials) {
        const href = (await social.getAttribute('href')).toLowerCase().trim();

        if (href.includes("mailto:")) email = href;
        else if (href.includes("tel:")) ddd = href;

        if (email && ddd) break;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { ddd, email } = await this.#getSocials(lawyer);

    return {
      name: await lawyer.findElement(By.className("person-card__name")).getText(),
      email: email,
      country: getCountryByDDD(ddd)
    };

  }
}

module.exports = SpencerWest;
async function main() {
  t = new SpencerWest();
  t.searchForLawyers();
}

main();
