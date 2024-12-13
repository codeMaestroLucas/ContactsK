/**
 * Print the Header of an search operation
 * @param {string} firmName of the firm
 * @param {string} separator. Defaults to "="
 */
async function header(firmName, separator = "=") {
  const totalLength = 100;
  const name = `| ${ firmName } |`;
  const sideLength = Math.floor((totalLength - name.length) / 2);

  const leftSide = separator.repeat(sideLength);
  const rightSide = separator.repeat(
    totalLength - (leftSide.length + name.length)
  );

  console.log(`\n${ leftSide }${ name }${ rightSide }\n`);
}

/**
 * Return a ramdon number basaed in the length of the lawfirms
 * @param {number} lawFirmsLen
 * @returns {number} random number
 */
async function getRandomNumber(lawFirmsLen) {
  let randomIndex = Math.floor(Math.random() * lawFirmsLen);
  return randomIndex;
}

module.exports = { header, getRandomNumber };
