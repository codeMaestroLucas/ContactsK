const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DillonEustace extends ByPage {
  constructor(
    name = "Dillon Eustace",
    link = "https://www.dilloneustace.com/people/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    await driver
      .wait(
        until.elementLocated(
          By.xpath('//*[@id="main"]/section[2]/div/div[1]/div[2]/div[1]/input')
        ), 60000
      )
      .sendKeys("partner");

    return await driver.wait(
      until.elementsLocated(
        By.className("styles_content___cPpV")
      ), 100000
    );
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h2"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("styles_links__6LPJw"))
      .findElements(By.css("a"));
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

module.exports = DillonEustace;