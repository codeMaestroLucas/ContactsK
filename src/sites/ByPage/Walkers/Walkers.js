const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Walkers extends ByPage {
  constructor(
    name = "Walkers",
    link = "https://www.walkersglobal.com/en/People?position=Partner&page=1",
    totalPages = 13
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.walkersglobal.com/en/People?position=Partner&page=${ index + 1 }`;
    super.accessPage(index, otherUrl);
    await new Promise(resolve => setTimeout(resolve, 500));
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("body-wrapper")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("titles-wrapper"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("titles-wrapper"))
      .findElement(By.className("title"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("contacts-wrapper"))
      .findElement(By.className("email-wrapper"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("contacts-wrapper"))
      .findElement(By.className("number-wrapper"))
      .getAttribute("href");
  }
  

  async getLawyer(lawyer) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const phone = await this.#getPhone(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = Walkers;
