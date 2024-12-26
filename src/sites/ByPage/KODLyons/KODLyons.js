const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KODLyons extends ByPage {
  constructor(
    name = "KOD Lyons",
    link = "https://kodlyons.ie/our-team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("fusion-portfolio-content")
      ), 100000
    );

    const webRole = [
      By.className("entry-title fusion-post-title"),
      By.css("a")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("entry-title fusion-post-title"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("entry-title fusion-post-title"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML");
  
    return await super.getContentFromTag(html).split(",")[0];
  }
 

  async #getEmail(lawyer) {
    const socials = await lawyer.findElements(
      By.className("fusion-li-item")
    );
    
    for (let social of socials) {
      const href = await social
        .findElement(By.css("a"))
        .getAttribute("href");

      if (href.includes("mailto:")) return href;
    }
  }

  
  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: "+353 1 679 0780", // Default phone
      country: "Ireland"
    };
  }
}

module.exports = KODLyons;
