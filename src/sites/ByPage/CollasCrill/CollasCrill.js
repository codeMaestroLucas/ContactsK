const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CollasCrill extends ByPage {
  constructor(
    name = "Collas Crill",
    link = "https://www.collascrill.com/people/all-locations/partners/all-practices/",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    const partnersDiv = await driver.wait(
      until.elementLocated(
        By.id("people-list")
      ), 100000
    );
    const partners = await partnersDiv.findElements(By.css("li"));
    return partners;
  }

  async #getName(lawyer) {
    const nameDivs = await lawyer.findElements(By.className("name"));

    if (nameDivs.length === 0) {
      return "";
    }

    let nameTxt = await nameDivs[0].getText();
    nameTxt = nameTxt.trim();
    if (nameTxt === "") {
      nameTxt = await nameDivs[1].getText();
    }

    return nameTxt;
  }

  async #getSocials(lawyer) {
    const socialsDiv = await lawyer.findElement(By.className("icons"));
    const socials = await socialsDiv.findElements(By.css("a"));

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) {
        email = href.replace("mailto:", "");
        // Need to replace the email so the name doesn't conflict when it's not
        // found in the name function
      } else if (href.includes("tel:")) {
        ddd = href;

        if (ddd.startsWith("00")) {
          ddd = ddd.replace("00", "");
        }
      }
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);
    let name = await this.#getName(lawyer);

    if (!name && email) {
      // Somehow i can't get all the NAMES from the lawyers
      const emailNamePart = email.split("@")[0]; // Get the part before '@'
      name = emailNamePart
        .split(".") // Split by '.' if present
        .join(" "); // Join the parts with a space
    }

    return {
      name: name,
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = CollasCrill;
