const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


//! This site loads slowly
class Mourant extends ByNewPage {
  constructor(
    name = "Mourant",
    link = "https://www.mourant.com/people/?searchValue=&locationId=&lawPracticedId=&serviceId=&sectorId=&positionId=2840",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.mourant.com/home/people.aspx?searchValue=&locationId=&lawPracticedId=&serviceId=&sectorId=&positionId=2840&page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);

  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("people-item")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    try {
      return await driver
        .findElement(By.css("h1"))
        .getText();
    } catch (error) {}
  }

  async #getSocials() {
    const socials = await driver
      .findElement(By.className('share hide_on_mobile'))
      .findElements(By.css('ul > li > a'))
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = Mourant;
