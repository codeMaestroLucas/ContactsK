const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DechertLLP extends ByPage {
  constructor(
    name = "Dechert LLP",
    link = "https://www.dechert.com/people-search.html?cq=29#position=Partner",
    totalPages = 26,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.dechert.com/people-search.html?cq=29#position=Partner&page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("article > div > div.flex-col.flex-1.w-full")
      ), 100000
    );
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("mt-2 mb-4 font-serif text-2xl duration-150 transition-opacity hover:opacity-75"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css("a"))
    return await super.getSocials(socials, true);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = DechertLLP;
