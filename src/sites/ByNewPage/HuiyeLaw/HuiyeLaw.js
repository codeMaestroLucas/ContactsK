const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HuiyeLaw extends ByNewPage {
  constructor(
    name = "Huiye Law",
    link = "https://www.huiyelaw.com/Zyry/index/zhiwei/1/p/1.html",
    totalPages = 17,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    let otherUrl = ``;
    if (index < 5) {
      // Senior Partners
      otherUrl = `https://www.huiyelaw.com/Zyry/index/zhiwei/1/p/${ index + 1 }.html`
    } else {
      // Partners
      otherUrl = `https://www.huiyelaw.com/Zyry/index/zhiwei/2/p/${ index - 4 }.html`
    }

    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("rightnr")
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
      .findElement(By.css("h2.title:nth-child(2)"))
      .getText();
  }


  async #getEmail(lawyer) {
    const html = await lawyer
      .findElement(By.css("p"))
      .getAttribute("outerHTML");

      const email = (await super.getContentFromTag(html)).trim();
      const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      
      const emailMatch = email.match(regex);
      return emailMatch ? emailMatch[0] : null;
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("crew-info"));
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: "China",
    };
  }
}

module.exports = HuiyeLaw;
