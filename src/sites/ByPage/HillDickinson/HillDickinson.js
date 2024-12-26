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


  async #getLik(lawyer) {
    return await lawyer
      .findElement(By.className("card-heading u-text-normal u-mb-0 u-font-normal u-mb-1 u-leading-tight"))
      .findElement(By.css("a"))
      .getAttribute("href");
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
    let phone;
  
    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) {
        phone = href.replace("tel:%2B", "").replace("%280%29", "0");
        // Remove so it doesn`t interfere in the phone
      }

      if (email && phone) break;
    }

    return { email, phone }
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLik(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = HillDickinson;
