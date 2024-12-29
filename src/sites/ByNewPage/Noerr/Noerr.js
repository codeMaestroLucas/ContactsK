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
    return await super.getSocials(socials);
  }
  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("MuiContainer-root MuiContainer-maxWidthXl css-vvmory"));
    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = Noerr;
