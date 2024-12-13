const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KeystoneLaw extends ByNewPage {
  constructor(
    name = "Keystone Law",
    link = "https://www.keystonelaw.com/lawyers?_sf_s=partner&lang=en&sf_paged=1",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherLink = `https://www.keystonelaw.com/lawyers?_sf_s=partner&lang=en&sf_paged=${ index + 1 }`
    await super.accessPage(index, otherLink);
    await driver.findElement(By.id("ccc-notify-accept")).click();
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("staff-image")
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
      .findElement(By.className("name notranslate"))
      .getText();
  }


  async #getEmail(lawyer) {
    return (await lawyer
      .findElement(By.className("email staff-contact"))
      .findElement(By.css("a"))
      .getAttribute("href")
    ).replace("?subject=Enquiry%20from%20website", "")
  }


  
  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.className("staff-header")
      ), 6000
    );
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "England",
    };
  }

}

module.exports = KeystoneLaw;
