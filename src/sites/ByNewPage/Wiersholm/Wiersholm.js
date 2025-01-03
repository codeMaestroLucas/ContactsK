const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Wiersholm extends ByNewPage {
  constructor(
    name = "Wiersholm",
    link = "https://www.wiersholm.no/mennesker?type=Partner",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    for (let i = 0; i < 6; i++) {
      const loadMoreBtn = await driver
        .findElement(By.className("Container__StyledContainer-sc-1a1keuk-0 hFrQWL footer-load"))
        .findElement(By.className("Button__ButtonWrapper-sc-nd9pfz-0 kZyING 0"));

      await driver.executeScript("arguments[0].click();", loadMoreBtn);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("div.people-blocks > a.item")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("employee-title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('contact-info'))
      .findElements(By.css('li.item > a'))
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("person-info"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Norway"
    };
  }
}

module.exports = Wiersholm;
