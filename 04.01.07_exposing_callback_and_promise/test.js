const asyncDivision = require('./index');

asyncDivision(10, 2, (error, result) => {
  if (error) {
    return console.error(error);
  }
  console.log(result);
});

asyncDivision(10, 2).then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
})