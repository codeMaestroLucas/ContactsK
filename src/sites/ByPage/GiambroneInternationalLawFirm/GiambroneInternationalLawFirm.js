const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GiambroneInternationalLawFirm extends ByPage {
  constructor(
    name = "Giambrone International Law Firm",
    link = "https://www.giambronelaw.com/site/people/senior-lawyers/",
    totalPages = 1,  // 3 Pages but all the lawyers are inserted in the 1st page, just have the display as `none`
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
   await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("staff-attributes")
      ), 100000
    );
    const webRole = [
      By.className("staff-details"),
      By.className("jobtitle")
    ];
    const partners = await super.filterPartnersInPage(lawyers, webRole, false);
    return partners.slice(14);
    // First 14 aren't valid options
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("staff-details"))
      .findElement(By.className("name h4"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML")
    return await super.getContentFromTag(html);
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('staff-contact'))
      .findElements(By.css('a'));
  
    let email;
    const ddd = await lawyer
      .findElement(By.className('staff-contact'))
      .findElement(By.className("phone has-icon"))
      .findElement(By.className("icon-link"))
      .findElement(By.css("a"))
      .getAttribute("href")
  
    for (let social of socials) {
      const href = await social
        .getAttribute('href');
      if (href.includes('mailto:')) email = href.replace("?subject=Email%20from%20website:", "");
  
      if (email) break;
    }
  
    return { email, ddd };
  }


  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = GiambroneInternationalLawFirm;
