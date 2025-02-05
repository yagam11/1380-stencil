const distribution = require('../../config.js');
const util = distribution.util;

test('(3 pts) (scenario) 40 bytes object', () => {
  /*
          Come up with a JavaScript object, which when serialized,
          will result in a string that is 40 bytes in size.
      */
  let object = "browncs/2025";

  const serialized = util.serialize(object);
  expect(serialized.length).toBe(40);
});

test('(3 pts) (scenario) object fix', () => {
  /* Modify the following object so that when serialized,
           results in the expected string. */

  //let object = {a: 'jcerb', b: -87, c: (a) => 4};
  let object = {
    a: "jcarb" , // Fixed value "jcerb" → "jcarb"
    b: 1,     // Fixed value -87 → 1
    c: (a, b) => a + b // Function fixed
  };
  // eslint-disable-next-line
    const serializedObject = '{"type":"object","value":{"a":"{\\"type\\":\\"string\\",\\"value\\":\\"jcarb\\"}","b":"{\\"type\\":\\"number\\",\\"value\\":\\"1\\"}","c":"{\\"type\\":\\"function\\",\\"value\\":\\"(a, b) => a + b\\"}"}}';
  expect(util.serialize(object)).toBe(serializedObject);
});

test('(3 pts) (scenario) string deserialized into target object', () => {
  /*
          Come up with a string that when deserialized, results in the following object:
          {a: 1, b: "two", c: false}
      */

  let string = '{"type":"object","value":{"a":{"type":"number","value":1},"b":{"type":"string","value":"two"},"c":{"type":"boolean","value":false}}}';

  const object = {a: 1, b: 'two', c: false};
  const deserialized = util.deserialize(string);
  expect(object).toEqual(deserialized);
});

test('(3 pts) (scenario) object with all supported data types', () => {
/* Come up with an object that uses all valid (serializable)
    built-in data types supported by the serialization library. */
  let object = {
    str: "Hello",                      // string
    num: 42,                           // number
    bool: true,                        // boolean
    undef: undefined,                  // undefined
    nul: null,                         // null
    arr: [1, 2, 3],                    // Array
    obj: { key: "value" },             // Object
    date: new Date("2023-01-01"),      // Date
    err: new Error("Test error"),      // Error
    func: (a, b) => a + b              // Function (ignored in final check)
  };

  const setTypes = new Set();
  for (const k in object) {
    setTypes.add(typeof object[k]);
    if (typeof object[k] == 'object' && object[k] != null) {
      setTypes.add(object[k].constructor.name);
    } else if (typeof object[k] == 'object' && object[k] == null) {
      setTypes.add('null');
    }
  }

  const typeList = Array.from(setTypes).sort();
  const goalTypes = ['Array', 'Date', 'Error', 'Object',
    'boolean', 'function', 'null', 'number', 'object', 'string', 'undefined'];
  expect(typeList).toStrictEqual(goalTypes);

  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).not.toBeNull();

  // Deleting functions because they are not treated as equivalent by Jest
  for (const k in object) {
    if (typeof object[k] == 'function') {
      delete object[k];
      delete deserialized[k];
    }
  }
  expect(deserialized).toEqual(object);
});

test('(3 pts) (scenario) malformed serialized string', () => {
/* Come up with a string that is not a valid serialized object. */

  let malformedSerializedString = 'brown';

  expect(() => {
    util.deserialize(malformedSerializedString);
  }).toThrow(SyntaxError);
});


