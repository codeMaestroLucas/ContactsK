const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Dentons extends ByNewPage {
  constructor(
    name = "Dentons",
    link = "https://www.dentons.com/en/our-professionals?Filters=%26sectorid%3D%26practiceid%3D%26positionid%3DE8CC721CPARTN%26languageid%3D%26inpid%3D%26countryid%3DBC35EA90ANGOL,F7D8D146ANGUI,32A2CDA0ANTIG,9811AA6FARGEN,3B90E529AUSTR,823AD3C4AZERB,7CE95425BARBA,A19804D5BELGI,BE670748BOLIV,503F53F3BRAZI,33E2C954BRITI,23527CAECANAD,EE010DE9CAYMA,178DAD7CCHILE,A61A47F9CHINA,45C505F4COLOM,A350D33CCOSTA,0CD4AD25CZECH,1B7BADE4DOMIN,EB363C6FECUAD,B88B66C9EGYPT,68C589CAELSAL,9AC389AAFRANC,90D391DDGEORG,46475908GERMA,ADEF2B0FGRENA,EED0B238GUATE,8283CC85GUYAN,9F3FCBD6HONDU,1D882F98HUNGA,28FF543BINDIA,084F7380INDON,4A9C50D6IRELA,966179D6ITALY,B9A90B2CJAMAI,F95A9049JORDA,BA79F199KAZAK,D17DB010KENYA,2DAAD5C0LEBAN,7682CDD8LUXEM,10CFBB3EMALAY,23CFC4D2MAURI,6EE3E649MEXIC,3E796B5EMONTS,32D7B150MOROC,08148065MOZAM,BC696904MYANM,1833CF4ENAMIB,20D23DF7NETHE,8A7BDFB1NEWZE,6A738078NICAR,3E3DDCF1NIGER,17CBBE41OMAN,C8950447PANAM,8646A2ADPAPUA,3E5B7B2DPERU,5EA18D76PHILI,1F461D23POLAN,5C4A0B77QATAR,8B8DCACFROMAN,F583F048SAUDI,CA5B859ESINGA,24A3CA2ESLOVA,60A7E742SOUTH,B0B9B704SOUTH,264856A3SPAIN,F2E1ADE8TUNIS,F1BE0330TANZA,5B8EF264TRINI,E2106DA6TURKE,CC1A9759UGAND,66FBB024UNITE,00C27DB0UNITE,43F8AC1EURUGU,1F9EFB23VENEZ,0C4BCE08VIETN,C36420A3ZAMBI%26page%3D1",
    totalPages = 1,
  ) {
    super(name, link, totalPages, 500);
  }


  async accessPage(index) {
    await super.accessPage(index);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("col-desc")
      ), 100000
    );

    //TODO: Check how to click in the LOADMORE BTN or set a initial value for
    // the loop of loadmore
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a.name"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("bio_name_mobile"))
      .findElement(By.className("quote-sec"))
      .findElement(By.id("mobiletop"))
      .getAttribute("outerHTML");

    return await super.getContentFromTag(html);
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("social_mobile group"))
      .findElement(By.className("asideSocialMedia aside_emailme group"))
      .findElement(By.className("mid-curve-callout"))
      .findElement(By.css("h3"))
      .findElement(By.className("cmn-lightbox no-js-reload force"))
      .getAttribute("rel");
  }


  async #getDDD(lawyer) {
    return await lawyer
      .findElement(By.className("mobile"))
      .findElement(By.className("landscape"))
      .findElement(By.className("bio-contact"))
      .findElement(By.className("left_assign"))
      .findElement(By.className("callToDevice"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    const details = await driver.wait(
        until.elementLocated(By.id("About")
      ), 5000
    );
    return {
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      country: getCountryByDDD(await this.#getDDD(details)),
    };
  }
}

module.exports = Dentons;

async function main() {
  t = new Dentons();
  await t.searchForLawyers();
}

main();
