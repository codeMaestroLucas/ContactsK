const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HankunLaw extends ByPage {
  constructor(
    name = "Hankun Law",
    link = "https://www.hankunlaw.com/en/portal/list/index/id/2.html?city=&zw=9%2C10%2C11&ly=#detail",
    totalPages = 22,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.hankunlaw.com/en/portal/list/index/id/2.html?city=&zw=9%2C10%2C11&ly=&page=${ index + 1}`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("div.law-list > a")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .getAttribute("href");
  }



  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("info"))
      .findElement(By.className("t"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("info"))
      .findElement(By.className("ds"))
      .findElements(By.css("dd"))
    
    let email;
    let phone;

    for (let social of socials) {
      const href = await social.getText();
      if (href.includes("@hankunlaw.com")) email = href;
      else if (href.includes("+")) phone = href;

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

module.exports = HankunLaw;
