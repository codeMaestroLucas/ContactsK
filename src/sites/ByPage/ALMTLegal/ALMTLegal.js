const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ALMTLegal extends ByPage {
  constructor(
    name = "ALMT Legal",
    link = "https://almtlegal.com/mumbai-partner.php",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `https://almtlegal.com/bangalore-partner.php`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("profile_box")
      ), 100000
    );
  }

  async #getLink(lawyer) {
    return lawyer.findElement(By.css("a")).getAttribute("href");
  }

  async #getName(lawyer) {
    return await lawyer
        .findElement(By.css("h1"))
        .getText();
  }

  async #getSocials(lawyer) {
    const socials = (await lawyer
      .findElement(By.css('h3'))
      .getAttribute("outerHTML"))
      .split("<br>");

    let phone = socials[0].replace("<h3>", "").replace(/\/.*/, '').trim();
    let email = await super.getContentFromTag(socials[1]);
    
  
    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "India",
    };
  }

}

module.exports = ALMTLegal;
