/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
// const util = require("@brown-ds/distribution").util;
const util = distribution.util;


test('(1 pts) Serialize and deserialize a number', () => {
  let num = 42;
  
  let s = util.serialize(num);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");  // Ensure serialized output is a string
  expect(o).toBe(num);              // Ensure deserialization restores the value
});


test('(1 pts) Serialize and deserialize a string', () => {
  let str = "Distributed Systems";
  
  let s = util.serialize(str);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");  // Ensure serialized format is a string
  expect(o).toBe(str);              // Ensure deserialization restores the value
});


test('(1 pts) Serialize and deserialize a boolean', () => {
  let bool = true;
  
  let s = util.serialize(bool);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");
  expect(o).toBe(bool);
});


test('(1 pts) Serialize and deserialize null', () => {
  let val = null;
  
  let s = util.serialize(val);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");
  expect(o).toBe(null); // Ensure null is correctly restored
});


test('(1 pts) Serialize and deserialize undefined', () => {
  let val = undefined;
  
  let s = util.serialize(val);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");
  expect(o).toBe(undefined); // Ensure undefined is correctly restored
});

test('(1 pts) Serialize and deserialize a function', () => {
  let func = (a, b) => a + b;

  let s = util.serialize(func);
  let o = util.deserialize(s);

  expect(typeof s).toBe("string");  // Serialized format should be a string
  expect(typeof o).toBe("function"); // Ensure deserialized object is a function
  expect(o(3, 5)).toBe(8); // Ensure function logic is preserved
});
