const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LEXLogmannsstofa extends ByPage {
  constructor(
    name = "LEX Logmannsstofa",
    link = "https://www.lex.is/en/hlutverk/eigendur-en/",
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
        By.className("hold")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
     .findElement(By.css("a"))
     .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h4 strong"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("p > a"))
      .getAttribute("href");
  }



  async getLawyer(lawyer) {
    const details = await lawyer.findElement(By.className("descr"));

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      phone: "354 590 2600",  // Firm phone
      country: "Iceland",
    };
  }
}

module.exports = LEXLogmannsstofa;
