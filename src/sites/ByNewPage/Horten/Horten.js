const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Horten extends ByNewPage {
  constructor(
    name = "Horten",
    link = "https://en.horten.dk/people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);

    await driver
      .findElement(By.xpath('//*[@id="panelContentContainer"]/div/div/ul/li[2]/select/option[2]'))
      .click();
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("name hero__headline contact-hero__headline"))
      .getText();
  }


  async #getEmail(lawyer) {
    const email = (await lawyer
      .findElement(By.className("email"))
      .getText()
    ).replace("E-mail:", "").trim();

    // Invert string
    return email.split('').reverse().join('');
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("hero__content contact-hero__content"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "Denmark",
    };
  }
}

module.exports = Horten;
