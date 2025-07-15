const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class FoxAndMandal extends ByPage {
  constructor(
    name = "Fox And Mandal",
    link = "https://foxandmandal.co.in/our-team/?title=&designation=partner",
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
        By.className("team-CardinfoQ")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("pbmit-btn pbmit-btn-inline pbmit-btn-sm"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("qDetails"))
      .findElement(By.css("h5"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }
}

module.exports = FoxAndMandal;
