const fs = require('fs');
const path = require('path');

/**
 * Function that reads the file count.txt
 * @returns {string} formatted string
 */
function getTimesUsed() {
  return new Promise((resolve, reject) => {
    const countFile = path.join(__dirname, '..', '..', 'public', 'count.txt');

    fs.readFile(countFile, 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading the count file:', err);
        return reject('Error reading the count file');
      }

      let X = data ? parseInt(data, 10) : 0;
      X += 1;

      fs.writeFile(countFile, X.toString(), 'utf8', (err) => {
        if (err) {
          console.error('Error writing to the count file:', err);
          return reject('Error writing to the count file');
        }

        resolve(`${X}º time using it`);
      });
    });
  });
}

module.exports = getTimesUsed;
