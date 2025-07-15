const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class AnandAndAnand extends ByPage {
  constructor(
    name = "Anand And Anand",
    link = "https://www.anandandanand.com/our-team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("member_discription")
      ), 100000
    );
    return lawyers.slice(1); // The fisrt doesnt have any contact information
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h4"))
      .getText();
  }


  async #getLink(lawyer) {
    return lawyer.findElement(By.css("a:first-child")).getAttribute("href");
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("member_profile"))
      .findElements(By.css("div > a"))
      return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "India"
    };
  }

}

module.exports = AnandAndAnand;
