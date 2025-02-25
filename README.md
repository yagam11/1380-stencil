# distribution

This is the distribution library. When loaded, distribution introduces functionality supporting the distributed execution of programs. To download it:

## Installation

```sh
$ npm i '@brown-ds/distribution'
```

This command downloads and installs the distribution library.

## Testing

There are several categories of tests:
  *	Regular Tests (`*.test.js`)
  *	Scenario Tests (`*.scenario.js`)
  *	Extra Credit Tests (`*.extra.test.js`)
  * Student Tests (`*.student.test.js`) - inside `test/test-student`

### Running Tests

By default, all regular tests are run. Use the options below to run different sets of tests:

1. Run all regular tests (default): `$ npm test` or `$ npm test -- -t`
2. Run scenario tests: `$ npm test -- -c` 
3. Run extra credit tests: `$ npm test -- -ec`
4. Run the `non-distribution` tests: `$ npm test -- -nd`
5. Combine options: `$ npm test -- -c -ec -nd -t`

## Usage

To import the library, be it in a JavaScript file or on the interactive console, run:

```js
let distribution = require("@brown-ds/distribution");
```

Now you have access to the full distribution library. You can start off by serializing some values. 

```js
let s = distribution.util.serialize(1); // '{"type":"number","value":"1"}'
let n = distribution.util.deserialize(s); // 1
```

You can inspect information about the current node (for example its `sid`) by running:

```js
distribution.local.status.get('sid', console.log); // 8cf1b
```

You can also store and retrieve values from the local memory:

```js
distribution.local.mem.put({name: 'nikos'}, 'key', console.log); // {name: 'nikos'}
distribution.local.mem.get('key', console.log); // {name: 'nikos'}
```

You can also spawn a new node:

```js
let node = { ip: '127.0.0.1', port: 8080 };
distribution.local.status.spawn(node, console.log);
```

Using the `distribution.all` set of services will allow you to act 
on the full set of nodes created as if they were a single one.

```js
distribution.all.status.get('sid', console.log); // { '8cf1b': '8cf1b', '8cf1c': '8cf1c' }
```

You can also send messages to other nodes:

```js
distribution.all.comm.send(['sid'], {node: node, service: 'status', method: 'get'}, console.log); // 8cf1c
```

# Results and Reflections
# M1: Serialization / Deserialization

## Summary

My implementation comprises 5 software components, totaling 150 lines of code. Key challenges included understanding of the data structures of various data types, and familiarity to Javascript functions.

## Correctness & Performance Characterization

*Correctness*: I wrote 10 tests; these tests take ~0.5 seconds to execute. This includes objects with base types, functions, complex structures, nested and recursive structures, and edge cases such as special characters, empty objects, and malformed input.

*Performance*: The latency of various subsystems is described in the `"latency"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json. The associated script code  is latency.m1.js inside the test folder.


# M2: Actors and Remote Procedure Calls (RPC)

## Summary

My implementation comprises 5 software components, totaling 200 lines of code. Key challenges included getting familiar with http protocol and node configurations, as well as port conflict issues since we haven't implemented stop function in node comm.


## Correctness & Performance Characterization

*Correctness*: I wrote 5 tests; these tests take 0.475 s to execute.

*Performance*: I characterized the performance of comm and RPC by sending 1000 service requests in a tight loop. Average throughput and latency is recorded in `package.json`. Performance test file is named m2.perf.js under test folder.


## Key Feature

> How would you explain the implementation of `createRPC` to someone who has no background in computer science — i.e., with the minimum jargon possible?

CreateRPC is like asking the waiter/waitress what you want, and they will bring you when it is ready without you go to the kitchen and make the food, where createrpc is the person that takes your order, communicates it to the kitchen, and brings the food/result.

# M3: Node Groups & Gossip Protocols


## Summary


My implementation comprises 8 new software components, totaling 300 added lines of code over the previous implementation. Key challenges included getting familar with asynchronous function calls of Javascript and time of barely able to debug because everything is clogged together.


## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation


*Correctness* -- number of tests and time they take.
5 times takes about 5s.

*Performance* -- spawn times (all students) and gossip (lab/ec-only).
Time:        0.984 s, estimated 1 s

## Key Feature

> What is the point of having a gossip protocol? Why doesn't a node just send the message to _all_ other nodes in its group?
Cost configurable and fault tolerant.