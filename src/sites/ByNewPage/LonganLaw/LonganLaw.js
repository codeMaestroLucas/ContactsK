const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LonganLaw extends ByNewPage {
  constructor(
    name = "Longan Law",
    link = "https://www.longanlaw.com/en/professionals/?vs=&vr=0&vp=4&vf=0&vx=0",
    totalPages = 15,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }
  

  async accessPage(index) {
    const otherUrl = `https://www.longanlaw.com/en/professionals/page/${ index + 1 }/?vs&vr=0&vp=4&vf=0&vx=0`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("-inner")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("professional-detail-title"))
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail() {
    const socials = await driver
      .findElement(By.className("professional-detail-focus"))
      .findElement(By.className("professional-detail-contact"))
      .findElements(By.css("a"));

    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  
  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: "01085328000",
      country: "China",
    };
  }
}

module.exports = LonganLaw;
