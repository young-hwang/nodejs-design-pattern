'use strict';

const fs = require('fs');
const path = require('path');

function asyncFlowWithThunk(generatorFunction) {
  function callback(err) {
    if (err) {
      return generator.throw(err);
    }
    const results = [].slice.call(arguments, 1);
    const thunk = generator.next(results.length > 1 ? results : results[0]).value;
    thunk && thunk(callback);
  }
  const generator = generatorFunction(callback);
  const thunk = generator.next().value;
  thunk && thunk(callback);
}

const readFileThunk = (fileName, options) => {
  return (cb) => fs.readFile(fileName, options, cb);
}

const writeFileThunk = (fileName, options) => {
  return (cb) => fs.writeFile(fileName, options, cb);
}

asyncFlowWithThunk(function* (callback) {
  const fileName = path.basename(__filename);
  const myself = yield readFileThunk(fileName, 'utf8')
  yield writeFileThunk(`clone_of${fileName}`, myself);
  console.log('Clone created');
});

