const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class SimmonsWolfhagen extends ByNewPage {
  constructor(
    name = "Simmons Wolfhagen",
    link = "https://www.simwolf.com.au/team-members/?f_cat=&f_pos=6&f_loc=&f_key=",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("team-preview__image-container")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("banner__title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('banner-contacts'))
      .findElements(By.className('banner-contact'))
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("scaling-column scaling-column banner__content"));
    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Australia"
    };
  }
}

module.exports = SimmonsWolfhagen;
