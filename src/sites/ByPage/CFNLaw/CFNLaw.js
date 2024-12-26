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
    
    return super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("col-lg-2 mb-lg-0 mb-4"))
      .findElement(By.className("member-photo"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h3 > a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css("p > a"));
    
    let phone = null;
    let email = null;

    for (let social of socials) {
      const href = await social.getAttribute("href");
  
      if (href.includes("tel:")) {
        phone = href.replace("tel:%2B", "");

      } else if (href.includes("mailto:")) {
        email = href;
      }

      if (email && phone) break;
      
    }
    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Hong Kong",
    };
  }
}

module.exports = CFNLaw;
