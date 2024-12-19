const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CFNLaw extends ByPage {
  constructor(
    name = "CFN Law",
    link = "https://www.cfnlaw.com.hk/en/team.php",
    totalPages = 2,  // Just these two have Partners
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `${ this._link }?pid=0&id=0&page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("row no-gutters team-item align-items-center")
      ), 100000
    );

    const webRole = [
      By.className("col-lg-4 col-md-6"),
      By.css("h4")
    ];
    let partners = [];
    for (let lawyer of lawyers) {
      const role = await lawyer
        .findElement()
        .findElement()
        .getText();

      if (role.toLowerCase().includes("partner")) {
        const lawyerInfo = await lawyer.findElements(By.className("col-lg-4"))
        partners.push(lawyerInfo);
      }
      
    }
    
    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h3 > a"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("p:nth-child(2)"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    const divOne = lawyer[0];
    const divTwo = lawyer[1];
    return {
      name: await this.#getName(divOne),
      email: await this.#getEmail(divTwo),
      country: "Hong Kong",
    };
  }
}

module.exports = CFNLaw;
