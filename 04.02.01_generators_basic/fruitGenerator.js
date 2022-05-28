function* fruitGenerator() {
  yield 'apple';
  yield 'orange';
  return 'watermelon';
}

const newFruitGenerator = fruitGenerator();
console.log(newFruitGenerator.next());
console.log(1);
console.log(newFruitGenerator.next());
console.log(2);
console.log(newFruitGenerator.next());
console.log(3);
