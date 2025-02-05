const distribution = require('../config.js');
const util = distribution.util;
const { performance } = require("perf_hooks");

// Function to measure the average latency of a function
function measureLatency(func, input, iterations = 1000) {
  let times = [];

  for (let i = 0; i < iterations; i++) {
    let start = performance.now();
    let result = func(input); // Execute function
    let end = performance.now();
    times.push(end - start);
  }

  let avgTime = times.reduce((a, b) => a + b, 0) / iterations;
  return { avgTime, result };
}

// Workloads to test (T2-T4)
const workloads = {
  T2_baseTypes: [
    42, "hello", true, null, undefined
  ],
  T3_functions: [
    (a, b) => a + b,
    function namedFunc(x) { return x * 2; }
  ],
  T4_complex: [
    { key: "value", nested: { num: 10, arr: [1, 2, 3] } },
    new Date(),
    new Error("Test error"),
    [{ tr1: [1, "one"], tr2: [2, "two"], tr3: [3, "three"] }]
  ]
};

// Benchmark function
function benchmark(workloads) {
  let results = {};

  for (let category in workloads) {
    results[category] = {
      serialization: [],
      deserialization: []
    };

    workloads[category].forEach((item, index) => {
      // Measure serialization time
      let { avgTime: serializedTime, result: serializedData } = measureLatency(util.serialize, item);

      // Measure deserialization time (using previously serialized data)
      let deserializedTime = measureLatency(util.deserialize, serializedData).avgTime;

      results[category].serialization.push(serializedTime);
      results[category].deserialization.push(deserializedTime);
    });
  }

  return results;
}

// Print results
function printResults(results) {
  console.log("\n=== Latency Benchmark Results ===");
  for (let category in results) {
    console.log(`\nCategory: ${category}`);
    console.log(`  Avg Serialization Time: ${(results[category].serialization.reduce((a, b) => a + b, 0) / results[category].serialization.length).toFixed(6)} ms`);
    console.log(`  Avg Deserialization Time: ${(results[category].deserialization.reduce((a, b) => a + b, 0) / results[category].deserialization.length).toFixed(6)} ms`);
  }
}

// Run the benchmark
const results = benchmark(workloads);
printResults(results);
