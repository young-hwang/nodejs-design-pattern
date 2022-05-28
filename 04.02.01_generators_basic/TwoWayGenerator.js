function* twoWayGenerator() {
  const what = yield null;
  console.log('Hello ' + what);
}

const twoWay = twoWayGenerator();
twoWay.next();
twoWay.next('World');
twoWay.throw(new Error());