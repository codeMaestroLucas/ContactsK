const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HillDickinson extends ByPage {
  constructor(
    name = "Hill Dickinson",
    link = "https://www.hilldickinson.com/people?title=&position%5B%5D=95",
    totalPages = 9,
    maxLawyersForSite = 1
    // Even though this LawFirm has more than one country most of the lawyers are from England
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.hilldickinson.com/people?title=&position%5B95%5D=95&page=${ index }`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("u-flex u-flex-col u-flex-grow u-text-small u-o-0 u-w-0 ")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("card-heading u-text-normal u-mb-0 u-font-normal u-mb-1 u-leading-tight"))
      .findElement(By.css("a > span"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("u-justify-end"))
      .findElements(By.css("a"));

    let email;
    let ddd;
  
    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) {
        ddd = href.replace("tel:%2B", "");  // Remove so it doesn`t interfere in the DDD
      }
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

module.exports = HillDickinson;
