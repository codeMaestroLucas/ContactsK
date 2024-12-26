const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class NjordLaw extends ByPage {
  constructor(
    name = "Njord Law",
    link = "https://www.njordlaw.com/people?area_of_expertise=All&titles=103&spoken_languages=All",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("employee-list-item")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("employee-link"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("employee-link"))
      .findElement(By.className("employee-name"))
      .getAttribute("outerHTML");
    return await this.getContentFromTag(html);
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("employee-link employee-link-wrapper"))
      .findElements(By.css("div > a"));

    let email;
    let phone;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) phone = href.replace("tel:%28%2B", "").replace("%29", "");

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

module.exports = NjordLaw;
