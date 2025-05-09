const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");
const { until, By } = require("selenium-webdriver");

class HannesSnellman extends ByPage {
  constructor(
    name = "Hannes Snellman",
    link = "https://www.hannessnellman.com/people/?pagenum=1&role=19",
    totalPages = 1,
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);

    try {
      if (index === 0) {
        // Handle cookie acceptance
        const acceptAllBtn = await driver.wait(
          until.elementLocated(
            By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")
          ),
          10000
        );
        await acceptAllBtn.click();
      } else {
        // Handle pagination
        const nextBtn = await driver.wait(
          until.elementLocated(
            By.css(".vue__pager.pagination .vue__page.textLink.next")
          ),
          10000
        );
        await nextBtn.click();
      }
    } catch (error) {
      console.error(`Error accessing page ${index}:`, error.message);
      // Continue execution even if cookie button or next button isn't found
    }
  }

  async getLawyersInPage() {
    try {
      return await driver.wait(
        until.elementsLocated(By.css(".person-card__content")),
        15000
      );
    } catch (error) {
      console.error("Error locating lawyers:", error.message);
      return [];
    }
  }

  async #getName(lawyer) {
    try {
      return await lawyer
        .findElement(By.css(".person-card__title a"))
        .getText();
    } catch (error) {
      console.error("Error getting lawyer name:", error.message);
      return "Name not found";
    }
  }

  async #getEmail(lawyer) {
    try {
      return await lawyer.findElement(By.css(".person-card-email")).getText();
    } catch (error) {
      console.error("Error getting lawyer email:", error.message);
      return "Email not found";
    }
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Finland",
    };
  }
}

module.exports = HannesSnellman;

async function main() {
  t = new HannesSnellman();
  // t.accessPage(1);
  // t.accessPage(2);
  t.searchForLawyers();
}

main();
