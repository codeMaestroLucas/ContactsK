const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Akin extends ByPage {
  constructor(
    name = "Akin",
    link = "https://www.akingump.com/en/lawyers-advisors?po=1013125",
    totalPages = 26
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.akingump.com/en/lawyers-advisors?f=${ 12 * index }&po=1013125`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("rs-result styles__resultContainer--a591872f")
      ), 100000
    );
  }

  async #getName(lawyer) {
   return await lawyer
      .findElement(By.className("type__body fw-semibold u-standard-hover"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocial(lawyer) {
    const socials = await lawyer.findElements(
      By.className("type__button u-standard-hover")
    );

    let ddd = null;
    let email = null;

    for (let social of socials) {
      const href = await social.getAttribute("href");
  
      if (href.includes("tel:")) {
        ddd = href.replace("tel:%2B", "");

      } else if (href.includes("mailto:")) {
        email = href;
      }
      
    }
    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocial(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = Akin;
