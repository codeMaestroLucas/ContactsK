const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class WinstonAndStrawn extends ByPage {
  constructor(
    name = "Winston And Strawn",
    link = "https://www.winston.com/en/professionals?of=5103%2C278%2C1039905%2C286%2C282&po=1000001",
    totalPages = 2,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.winston.com/en/professionals?f=${ index * 20 }&of=5103%2C278%2C1039905%2C286%2C282&po=1000001`;
    await super.accessPage(index, otherUrl);
  }
  

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("col-sm-5 align-self-baseline")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("type__h3 py-2 pt-md-0 pb-md-1"))
      .findElement(By.className("null color-hover-aegean"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("type__h3 py-2 pt-md-0 pb-md-1"))
      .findElement(By.className("null color-hover-aegean"))
      .findElement(By.css("span"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("my-1 my-md-2 styles__childTypeLinkBlueGrayHover--f16c2240"))
      .findElement(By.className("d-print-none"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return (await lawyer
      .findElement(By.css("dl > dd:nth-child(5)"))
      .findElement(By.css("a"))
      .getAttribute("href"))
      .replace("tel:%2B", "");
  }


  async getLawyer(lawyer) {
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

module.exports = WinstonAndStrawn;
