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


  async getLawyer(lawyer) {
    return {
      name: await lawyer.findElement({ className: "title h8" }).getText(),
      country: await lawyer.findElement({ className: "light h14" }).getText(),
      email: await lawyer
        .findElement({ className: "email light-weight" })
        .getText(),
    };
  }
}

module.exports = Conyers;
