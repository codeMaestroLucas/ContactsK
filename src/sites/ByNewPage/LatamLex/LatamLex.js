const { getCountryByDDD } = require("../../../utils/getNationality");
const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LatamLex extends ByNewPage {
  constructor(
    name = "Latam Lex",
    link = "https://latamlex.com/en/equipo/",
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
      until.elementsLocated(By.css(".info > div")
      ), 100000
    );

    const webRole = [
      By.css('p[style*="text-transform:uppercase"]')
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.className("nombre"))
      .getText();
  }


  async #getSocials() {
    const socials = await driver
      .findElements(By.className("dato_"))

    const country = (await socials[0].getText()).replace("Country:", "").trim();
    let email;
    let phone;

    for (let social of socials) {
        const txt = await social.getText();
        if (txt.includes("Telephone:")) phone = txt;
        else if (txt.includes("Email:")) email = txt.replace("Email:", "");
    }

    return { email, phone, country };
  }
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("col-sm-12 col-md-7"));

    const { email, phone,country } = await this.#getSocials(details);
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: country
    };
  }
}

module.exports = LatamLex;
