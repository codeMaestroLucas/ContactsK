const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class EBN extends ByNewPage {
  constructor(
    name = "EBN",
    link = "https://www.ebnlaw.co.il/team-members/?lang=en&letter=&member=&practice=&role=8#search-result-section",
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
        By.className("member")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    let link = "";
    try {
      link = await lawyer
        .findElement(By.css("a"))
        .getAttribute("href");
      
    } catch (error) {}

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    const names = (await lawyer
      .findElement(By.css("h1"))
      .getText()).split(" ");

    return names[1] + " " + names[0];
  }


  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElement(By.className("personal-information"))
      .findElement(By.className("list-unstyled list-inline display-inline"))
      .findElements(By.css("li > a"));
    
    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }


  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("title-parent"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Israel",
    };
  }
}

module.exports = EBN;
