// test.js - файл с намеренными ошибками
const unusedVariable = "test"; // Неиспользуемая переменная
console.log(process.env.TEST); // process должен быть известен

function test() {
  let x = 1;
  x = 2;
  return x;
}
