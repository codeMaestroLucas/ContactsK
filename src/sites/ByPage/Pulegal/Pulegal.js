const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Pulegal extends ByPage {
  constructor(
    name = "Pulegal",
    link = "https://ppulegal.com/en/team/",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }
  

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("e-con-inner")
    ), 60000
    );
    return lawyers.slice(3, 64);  // This site is terrible
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(
        By.css(
          "div.elementor-element.elementor-element-60002ff.e-con-full.e-flex.wpr-particle-no.wpr-jarallax-no.wpr-parallax-no.wpr-sticky-section-no.e-con.e-child "
        )
      )
      .findElements(By.css("div > div > div > h2 > a"))

    let fullname = "";
    for (let name of nameElement) {
      fullname += await name.getText() + " " ;
    }
    
    return fullname;
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("elementor-element elementor-element-e696e29 elementor-widget elementor-widget-heading"))
      .findElement(By.className("elementor-widget-container"))
      .findElement(By.className("elementor-heading-title elementor-size-default"))
      .getText();
  }

  async #getCountry(lawyer) {
    const html = await lawyer
      .findElement(By.className("elementor-element elementor-element-3b7367c elementor-widget elementor-widget-heading"))
      .findElement(By.className("elementor-widget-container"))
      .findElement(By.className("elementor-heading-title elementor-size-default"))
      .findElement(By.css("span"))
      .getAttribute("outerHTML");
    return await this.getContentFromTag(html);
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: await this.#getCountry(lawyer),
    };
  }
}

module.exports = Pulegal;
