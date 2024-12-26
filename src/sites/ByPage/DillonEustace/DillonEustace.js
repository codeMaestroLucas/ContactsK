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
        By.className("styles_content__o1D_g")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("styles_name___cJ34"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("styles_name___cJ34"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("styles_email__wf6TI"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("styles_phoneNumber__Dt9t5"))
      .getText();
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

module.exports = DillonEustace;
