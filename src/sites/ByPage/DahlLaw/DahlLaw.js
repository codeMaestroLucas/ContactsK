const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DahlLaw extends ByPage {
  constructor(
    name = "DahlLaw",
    link = "https://www.dahllaw.dk/en/people/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    const addBtn = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="coiPage-1"]/div[2]/div[1]/button[3]'))
    )
    await addBtn.click();

    await this.rollDown(2, 1);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("employeecard__content span5-mobile-dwarf push0-mobile-dwarf")
      ), 100000
    );

    const webRole = [
      By.className("employeecard__jobtitle")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("employeecard__name"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("employeecard__name"))
      .findElement(By.css("h4"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('employeecard__contact'))
      .findElements(By.className('employeecard__contact-link'))
  
    let email;
    let phone;
  
    for (let social of socials) {
      const href = await social.getAttribute('href');
  
      if (href.includes('mailto:')) email = href;
      else if (href.includes('tel:')) phone = href;
  
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
      country: "Denmark",
    };
  }
}

module.exports = DahlLaw;
