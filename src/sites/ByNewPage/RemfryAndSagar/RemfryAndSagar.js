const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class RemfryAndSagar extends ByNewPage {
  constructor(
    name = "Remfry And Sagar",
    link = "https://www.remfry.com/our-team/",
    totalPages = 3, // Partners until the 3rd page
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.remfry.com/our-team/page/${ index +  1 }/`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.css("li.xxx > a.block")
      ), 100000
    );

    const webRole = [
      By.css("p:nth-child(3)")
    ];
    return super.filterPartnersInPage(lawyers, webRole, true);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("mkd-post-title"))
      .getText();
  }


  async #getEmail() {
    return await driver
      .findElement(By.className("mart38 marb38 flex"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: '911242806100',
      country: "India"
    };
  }
}

module.exports = RemfryAndSagar;
