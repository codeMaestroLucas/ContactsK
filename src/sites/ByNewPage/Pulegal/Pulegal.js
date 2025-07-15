const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Pulegal extends ByNewPage {
  constructor(
    name = "Pulegal",
    link = "https://ppulegal.com/en/team/",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
    const selector = await driver.findElement(By.id("roles"))
    await selector
      .findElement(By.css("option[value='393']"))
      .click();
  }
  

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("div.e-con-inner > div > div.elementor-widget-container > a")
    ), 60000
    );
  }


  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    const nameDiv = await lawyer
      .findElement(By.xpath('//*[@id="page"]/div/section[1]/div/div[1]/div/div[2]/div'))
      .findElements(By.css("h2"));

    let fullname;

    for (let name of nameDiv) {
      fullname += await name.getText() + " ";
    }
    return fullname.replace("undefined", "");
  }
  

  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.xpath('//*[@id="page"]/div/section[1]/div/div[1]/div/div[6]/div/div[1]/div/ul/li[1]/a'))
      .getAttribute('href');
    const phone = await lawyer
      .findElement(By.xpath('//*[@id="page"]/div/section[1]/div/div[1]/div/div[6]/div/div[2]/div/ul/li[1]/span[2]'))
      .getText();

    return { email, phone };
  }
  

  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("elementor-widget-wrap elementor-element-populated"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = Pulegal;
