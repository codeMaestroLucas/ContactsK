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

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("entry-title fusion-post-title"))
        .findElement(By.css("a"))
        .getText()).toLowerCase().trim();
      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("entry-title fusion-post-title"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML");
    
    const regex = /<a[^>]*>([^,]+),\s*([^<]+)<\/a>/i;
    const match = html.match(regex);

    let name;
    let role;

    if (match) {
      name = match[1].toLowerCase().trim();
      role = match[2].toLowerCase().trim();
    }
  
    return { name, role };
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
    const { name, role } = await this.#getName(lawyer);
  
    if (!role.includes("partner")) return "Not Partner";
  
    return {
      name: name,
      email: await this.#getEmail(lawyer),
      country: "Ireland"
    };
  }
}

module.exports = KODLyons;
