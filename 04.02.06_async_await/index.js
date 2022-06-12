'use strict';

const urllib = require('urllib');

function getPageHtml(url) {
  return new Promise((resolve, reject) => {
    urllib.request(url, function (err, data, res) {
      if (err) {
        throw err; // you need to handle error
      }
      resolve(data.toString());
    });
  });
}

async function main() {
  const html = await getPageHtml('http://google.com');
  console.log(html.data);
}

main();
console.log('Loading...');