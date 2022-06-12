const fs = require('fs');
const zlib = require('zlib');

const file = process.argv[2];

fs.readFile(file, (err, buffer) => {
  if (err) {
    console.error(err);
    return;
  }
  zlib.gzip(buffer, (err, buffer) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.writeFile(file + '.gz', buffer, err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('File successfully compressed.');
    })
  })
})