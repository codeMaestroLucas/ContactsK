const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class PearlCohen extends ByNewPage {
  constructor(
    name = "Pearl Cohen",
    link = "https://www.pearlcohen.com/our-team/?letter=&scroll=1&team_member_title=&role_id=16&location_id=17&practice_id=0&industry_id=0",
    totalPages = 4,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.pearlcohen.com/our-team/?letter&scroll=1&team_member_title&role_id=16&location_id=17&practice_id=0&industry_id=0&pagination=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("member-result__image")
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
      .findElement(By.className("masthead__title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('masthead__contact-list'))
      .findElements(By.css('li > a'))
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("masthead__caption"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Israel"
    };
  }
}

module.exports = PearlCohen;
