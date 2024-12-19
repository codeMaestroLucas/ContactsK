const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class WolfTheiss extends ByPage {
  constructor(
    name = "Wolf Theiss",
    link = "https://www.wolftheiss.com/people/",
    totalPages = 33
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.wolftheiss.com/people/page/${ index + 1 }/`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("col-md-6 col-lg-3 card__col")
      ), 100000
    );

    const webRole = [
      By.css(".card__detail:first-child")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("card__title"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.className("card__contact-item")
    );

    let email;
    let ddd;

    for (let social of socials) {
      let span = await social
        .findElement(By.css("span"))
        .getText();

      if (span.includes("@wolftheiss.com")) email = span;
      else if (span.includes("+")) ddd = span;

      if (email && ddd) break;
    }

    return { email, ddd }
  }


  async getLawyer(lawyer) {
   const { email, ddd } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = WolfTheiss;
