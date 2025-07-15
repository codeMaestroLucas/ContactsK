const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Conyers extends ByPage {
  constructor(
    name = "Conyers",
    link = "https://www.conyers.com/people/?keyword=&practicearea=&location=&position=partner-director&languages=&search=",
    totalPages = 5
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index,
      `https://www.conyers.com/people/page/${ index + 1 }/?keyword&practicearea&location&position=partner-director&languages&search`
    );
  }
  

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person-result-info flex-grid show-as-rows")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("title h8"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await lawyer.findElement(By.className("title h8")).getText(),
      email: await lawyer
        .findElement(By.className("person-contact-details"))
        .findElement(By.className("email light-weight"))
        .getText(),
      phone: await lawyer
        .findElement(By.className("person-contact-details"))
        .findElement(By.className("phone light-weight"))
        .getAttribute("href"),
      country: await lawyer.findElement(By.className("light h14")).getText(),
    };
  }
}

module.exports = Conyers;
