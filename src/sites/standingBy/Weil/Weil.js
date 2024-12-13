const { getCountryByDDD } = require("../../../../utils/getNationality");
let { driver } = require("../../../../config/driverConfig");
const ByPage = require("../../ByPage");

const { until, By } = require("selenium-webdriver");

class Weil extends ByPage {
  constructor(
    name = "Weil",
    link = "https://www.weil.com/people",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);

    // Add btn
    await driver.findElement(By.id("onetrust-accept-btn-handler")).click();

    //Partner option
    await driver
      .findElement(By.xpath('//*[@id="bebddbe92e7c4eb7b5975a809ad6a72a"]/div[2]/div/form/fieldset/div[1]/label'))
      .click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this.rollDown(13, 1);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    console.log(lawyers.length);
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""))

    
    return nameElement
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className(""))


    return emailElement
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className(""))
      
    return dddElement
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = Weil;

async function main() {
  t = new Weil();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
