const { getCountryByDDD } = require("../../../utils/getNationality");

let { driver } = require("../../../config/driverConfig");
const Site = require("../Site");

const { until, By } = require("selenium-webdriver");


//FILTER
class Template extends Site {
  constructor(
    name = "Arias",
    link = "https://ariaslaw.com/en/our-people/0",
    totalPages = 3
  ) {
    super(name, link, totalPages);
  }

  async #clickOnEnglishBtn() {
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Click the English language button
    await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="inspire"]/div[1]/main/div/div[3]/div[1]/div/div/div/div[3]/div/div[2]/div')
      )
    ).click();

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);
    }
    const nextPageButton = await driver.wait(
      until.elementLocated(By.css('button[aria-label="Next page"]')),
      5000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", nextPageButton);
    await nextPageButton.click();
    
  }


  async getLawyersInPage() {
    return await driver.wait(until.elementsLocated(By.className("")));
  }

  async #getName(lawyer) {}

  async #getEmail(lawyer) {}

  async #getDDD(lawyer) {}

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

  async searchForLawyers() {
    await super.searchForLawyers();
  }
}

module.exports = Template;

async function main() {
  t = new Template();
  await t.accessPage(0);
  await t.accessPage(1);
}

main();
