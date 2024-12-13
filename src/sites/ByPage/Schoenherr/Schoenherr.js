const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Schoenherr extends ByPage {
  constructor(
    name = "Schoenherr",
    link = "https://www.schoenherr.eu/people?position=partner",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("people-card")
      ), 100000
    );
  }
  
  async #getName(lawyer) {
    const nameTag = await lawyer
      .findElement(By.className("people-card-name"))
      .getAttribute("outerHTML");

    const regex = /<span>(.*?)<\/span>/g;
    const matches = [...nameTag.matchAll(regex)].map(match => match[1].trim());

    const fullName = matches.join(' ').toLowerCase().trim();
    return fullName;
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.css(".people-card-info-item > a")
    );

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("outerHTML");
      const result = href.replace(/<a[^>]*>(.*?)<\/a>/, "$1");

      if (result.includes("@schoenherr")) email = result;
      else if (result.includes("+")) ddd = result;
    }

    return { email, ddd };
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

module.exports = Schoenherr;
