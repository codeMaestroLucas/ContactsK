const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LangsethAdvokat extends ByNewPage {
  constructor(
    name = "Langseth Advokat",
    link = "https://langsethadvokat.no/en/about-us/oversikt-partnere/?_gl=1*18s0ld5*_up*MQ..*_gs*MQ..&gclid=Cj0KCQiA9667BhDoARIsANnamQbX48kMWhzWxxQwxHQKHaxM0I81SxO3GnDuVotVQjc7wA0XgMedVqwaAmwcEALw_wcB",
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
        By.css("ul.deopartners > li > a")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h2"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElements(By.css("ul.info > li > a"));
    return await super.getSocials(socials);
  }
  
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("employee-title-column"));

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

module.exports = LangsethAdvokat;
