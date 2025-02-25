const { serialize, deserialize } = require("@brown-ds/distribution/distribution/util/util");
// function serialize(object) {
//   if (object === null) {
//     return JSON.stringify({type: 'null', value: null });
//   }
//   if (object === undefined) {
//     return JSON.stringify({ type: "undefined" });
//   }
//   if (typeof object === "number") {
//     return JSON.stringify({ type: "number", value: object });
//   }
//   if (typeof object === "string") {
//     return JSON.stringify({ type: "string", value: object });
//   }
//   if (typeof object === "boolean") {
//     return JSON.stringify({ type: "boolean", value: object });
//   }
//   if (typeof object === "function") {
//     return JSON.stringify({ type: "function", value: object.toString() });
//   }
//   if (object instanceof Date) {
//     return JSON.stringify({ type: "date", value: object.toISOString() });
//   }
//   if (object instanceof Error) {
//     return JSON.stringify({ type: "error", value: object.message });
//   }
//   if (Array.isArray(object)) {
//     return JSON.stringify({
//       type: "array",
//       value: object.map((item) => JSON.parse(serialize(item))),
//     });
//   }
//   if (typeof object === "object") {
//     let serializedObject = {};
//     for (let key in object) {
//       serializedObject[key] = JSON.parse(serialize(object[key]));
//     }
//     return JSON.stringify({ type: "object", value: serializedObject });
//   }

//   throw new Error("Unsupported type");
// }

// function deserialize(string) {
//   let obj = JSON.parse(string);
//   if (obj.type === "null") {
//     return null;
//   }
//   if (obj.type === "undefined") {
//     return undefined;
//   }
//   if (obj.type === "number") {
//     return obj.value;
//   }
//   if (obj.type === "string") {
//     return obj.value;
//   }
//   if (obj.type === "boolean") {
//     return obj.value;
//   }
//   if (obj.type === "function") {
//     return new Function(`return ${obj.value}`)(); // Converts the string back into a function
//   }
//   if (obj.type === "date") {
//     return new Date(obj.value);
//   }
//   if (obj.type === "error") {
//     return new Error(obj.value);
//   }
//   if (obj.type === "array") {
//     return obj.value.map((item) => deserialize(JSON.stringify(item)));
//   }
//   if (obj.type === "object") {
//     let deserializedObject = {};
//     for (let key in obj.value) {
//       deserializedObject[key] = deserialize(JSON.stringify(obj.value[key]));
//     }
//     return deserializedObject;
//   }

//   throw new Error("Unsupported type");
// }

// module.exports = {
//   serialize: serialize,
//   deserialize: deserialize,
// };


module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};