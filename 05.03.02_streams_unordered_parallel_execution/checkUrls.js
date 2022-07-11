'use strict';
const fs = require('fs');
const split = require('split');
const axios = require('axios');
const ParallelStream = require('./parallelStream');
fs.createReadStream(process.argv[2])
  .pipe(new ParallelStream((url, enc, push, done) => {
    if (!url) return done();
    axios
      .get(url)
      .then(res => {
        push(url + ' is up\n');
        callback();
      })
      .catch(err => {
        push(url + ' is down\n');
        callback(err)
      })
  }))
  .pipe(fs.createWriteStream('result.txt'))
  .on('finish', () => console.log('All urls were checked'));