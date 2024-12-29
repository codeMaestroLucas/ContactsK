const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HSAAdvocates extends ByNewPage {
  constructor(
    name = "HSA Advocates",
    link = "https://hsalegal.com/team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);

    const partnerFilter = await driver.wait(
      until.elementsLocated(By.className("nav-link"))
    );
    await partnerFilter[2].click();
    new Promise(resolve => setTimeout(resolve, 4000));
  }

  async getLawyersInPage() {
    return await driver.wait(until.elementsLocated(By.className("team-item")));
  }

    
  async openNewTab(lawyer) {
    const links = await lawyer
      .findElements(By.css("a"))

    for (let a of links) {
      const link = await a.getAttribute("href");
      if (link.includes("hsalegal.com/team")) {
        await super.openNewTab(link);
      }
    }
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("single-personn-title"))
      .findElement(By.className("mb-0 text-white"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("single-person-contact"))
      .findElement(By.className("row text-center no-gutters"))
      .findElements(By.css("a"));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("row no-gutters team-bg-grad align-items-end pt-lg-2"))
      .findElement(By.className("col-lg-8 text-white"))
      .findElement(By.className("single-person-detail pl-lg-4 pt-4"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "India",
    };
  }
}

module.exports = HSAAdvocates;
