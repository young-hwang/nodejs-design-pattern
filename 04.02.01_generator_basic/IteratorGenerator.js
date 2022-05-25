function* iteratorGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log('index ' + i);
    yield arr[i];
  }
}

const iterator = iteratorGenerator(['apple', 'orange', 'watermelon']);
let currentItem = iterator.next();
while(!currentItem.done) {
  console.log(currentItem.value);
  currentItem = iterator.next();
}