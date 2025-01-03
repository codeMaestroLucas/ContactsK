const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class BirdAndBird extends ByNewPage {
  constructor(
    name = "Bird And Bird",
    link = "https://www.twobirds.com/en/people#f:@countrynames=[Australia,Belgium,China,Czech%20Republic,Denmark,Finland,France,Germany,Hungary,Ireland,Italy,Japan,Morocco,Netherlands,Poland,Singapore,Slovak%20Republic,Spain,Sweden,UAE,United%20Kingdom]",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  //* Loads on click

  async accessPage(index) {
    await super.accessPage(index);

    await driver
      .findElement(By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"))
      .click();

    const loadMoreBtn = await driver
      .findElement(By.className('CoveoLoadMoreResults'));

    const actions = driver.actions();

    for (let i = 0; i < 8; i++) {
      // Every rolldown loads more 9 lawyers - 90 now
      await actions.move({ origin: loadMoreBtn }).perform();

      await new Promise(resolve => setTimeout(resolve, 500));

      await loadMoreBtn.click();

      await super.rollDown(1, 2);
    }
  }

 
  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.css("div.coveo-result-row.card--image > a.CoveoResultLink")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    return await driver
      .findElement(By.css("h1"))
      .getText();
  }


  async #getEmail() {
    return (await driver
      .findElement(By.className("icon--group"))
      .findElement(By.className("icon social email"))
      .getAttribute("href")
    ).replace("?subject=twobirds.com%20enquiry%3A%20%5BAdd%20subject%20here%5D", "");
  }


  async #getPhone() {
    return await driver
      .findElement(By.className("icon--group"))
      .findElement(By.className("icon social phone"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.className("hero--person-details")
      ), 5000
    )
    
    const role = (await details
      .findElement(By.className("card--role"))
      .getText()
    ).toLowerCase();

    if (!role.includes("partner")) return "Not Partner";

    const phone = await this.#getPhone();

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = BirdAndBird;
