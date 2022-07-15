'use strict';

const fs = require('fs');
const split = require('split');
const axios = require('axios');
const ParallelStream = require('./LimitedParallelStream');

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(new ParallelStream(2, (url, enc, done, push) => {
    if (!url) return done();
    axios
      .get(url)
      .then(() => {
        push(url + ' is up\n');
        done();
      })
      .catch(err => {
        push(url + ' is down\n');
        done(err)
      })
  }))
  .pipe(fs.createWriteStream('result.txt'))
  .on('finish', () => console.log('All urls were checked'));