const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

const server = http.createServer((req, res) => {
  const filename = req.headers.filename;
  console.log(`File request received: ${filename}`);
  req
    .pipe(crypto.createDecipheriv('aes-256-cbc', '12345678123456781234567812345678', '1111111111111111'))
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(filename + '_copy'))
    .on('finish', () => {
      res.writeHead(201, {'Content-Type': 'text/plain'});
      res.end(`That's it\n`);
      console.log(`File saved: ${filename}`);
    });
});

server.listen(3000, () => console.log('Listening'));