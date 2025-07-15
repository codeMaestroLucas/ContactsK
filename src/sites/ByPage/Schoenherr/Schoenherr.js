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
    await super.rollDown(1, 2);
  }


  async getLawyersInPage() {
    const lawyers =  await driver.wait(
      until.elementsLocated(
        By.className("people-card")
      ), 100000
    );

    const webRole = [
      By.className("people-card-occupation")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }
  

  async #getLink(lawyer) {
    return await lawyer
     .findElement(By.className("people-card-info"))
     .findElement(By.className("btn btn--primary btn--bigger people-card-cta"))
     .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("people-card-name"))
      .getAttribute("outerHTML");

      const pattern = /<span>(.*?)<\/span>.*?<span[^>]*>(.*?)<\/span>/s;
      const match = html.match(pattern);
      if (match) {
          return match[1].trim() + " " + match[2].trim();
      }
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.css(".people-card-info-item > a")
    );

    let email;
    let phone;

    for (let social of socials) {
      const href = await social.getAttribute("outerHTML");
      const result = href.replace(/<a[^>]*>(.*?)<\/a>/, "$1");

      if (result.includes("@schoenherr")) email = result;
      else if (result.includes("+")) phone = result;

      if (email && phone) break;
    }

    return { email, phone };
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = Schoenherr;
