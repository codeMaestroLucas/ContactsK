const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class TCLawFirm extends ByNewPage {
  constructor(
    name = "TC Law Firm",
    link = "https://en.tclawfirm.com/list-5/page/1.html?ext_name=&ext_business_area=&ext_office=&ext_position=Partner",
    totalPages = 7,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://en.tclawfirm.com/list-5/page/${ index + 1 }.html?ext_name=&ext_business_area=&ext_office=&ext_position=Partner`;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css(".col-lg-2.col-md-6.col-xs-12.mb-10 > a")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const html = await driver
      .findElement(By.className("title"))
      .getAttribute("outerHTML");
    return await super.getContentFromTag(html);
  }


  async #getSocials() {
    const socials = await driver
      .findElement(By.className("member"))
      .findElement(By.className("member-left"))
      .findElement(By.className("pl-0"))
      .findElements(By.css("li"))
      

    let email;
    let phone;

    for (let social of socials) {
      const text = (await social.getText()).toLowerCase();
      if (text.includes("@tclawfirm")) email = text.replace("email:", "");
      else if (text.includes("tel: ")) phone = text;

      if (email && phone) break;
    }

    return { email, phone };
  }

  
  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials();
    
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: email,
      phone: phone,
      country: "Hong Kong"
    };
  }
}

module.exports = TCLawFirm;
