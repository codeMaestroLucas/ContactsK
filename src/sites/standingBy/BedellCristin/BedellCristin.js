const { getCountryByDDD } = require("../../../../utils/getNationality");
let { driver } = require("../../../../config/driverConfig");
const ByPage = require("../../ByPage");

const { until, By } = require("selenium-webdriver");


//TODO: Transform this in the ByClick
class BedellCristin extends ByPage {
  constructor(
    name = "Bedell Cristin",
    link = "https://www.bedellcristin.com/people/?Role=Partner",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
    try {

    } catch (e) {}
    
    for (let retry = 0; retry < 3; retry++) {
      try {
        const moreLawyersBtn = await driver.findElement(By.className("button--component v--primary"));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", moreLawyersBtn);
        await moreLawyersBtn.click(); // Normal Selenium click
        console.log(`Click succeeded on attempt ${retry + 1}`);
        break; // Exit loop if click succeeds
      } catch (e) {
        console.log(`Click failed on attempt ${retry + 1}, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        if (retry === 2) {
          // Use JS fallback on the last attempt
          console.log("Using JavaScript to click.");
          const moreLawyersBtn = await driver.findElement(By.className("button--component v--primary"));
          await driver.executeScript("arguments[0].click();", moreLawyersBtn);
          console.log("Clicked")
        }
      }
    }

  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(until.elementsLocated(By.className("card-content")));
    console.log(lawyers.length);
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer.findElement(
      By.className("")
    );
    console.log(await nameElement.getAttribute("outerHTML"));
    console.log(await nameElement.getText());
    return await nameElement.getText();
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer.findElement(
      By.className("")
    );
    console.log(await emailDivs.getAttribute("outerHTML"));
    console.log(await emailDivs.getText());

    return await emailElement.getAttribute("href");
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer.findElement(
      By.className("")
    );
    console.log(await dddElement.getAttribute("outerHTML"));
    console.log(await dddElement.getText());
    return await dddElement.getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = BedellCristin;

async function main() {
  t = new BedellCristin();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
