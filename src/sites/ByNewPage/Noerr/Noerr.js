const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Noerr extends ByNewPage {
  constructor(
    name = "Noerr",
    link = "https://www.noerr.com/en/professionals?p-fc-roles=Partner",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("MuiTypography-root MuiTypography-inherit MuiTypography-gutterBottom MuiLink-root MuiLink-underlineNone css-1v5l7xj")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom css-pdf1oj"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('MuiBox-root css-vgsl4f'))
      .findElements(By.css('div.MuiBox-root.css-axw7ok > a'));
  
    let email;
    let ddd;
  
    for (let social of socials) {
      const href = await social
        .getAttribute('href');
  
      if (href.includes('mailto:')) email = href;
      else if (href.includes('tel:')) ddd = href;
  
      if (email && ddd) break;
    }
  
    return { email, ddd };
  }
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("MuiContainer-root MuiContainer-maxWidthXl css-vvmory"));
    const { email, ddd } = await this.#getSocials(details)

    return {
      name: await this.#getName(details),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = Noerr;
