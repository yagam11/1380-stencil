const distribution = require('../config.js');
const { performance } = require('perf_hooks');

// Function to measure performance of comm
async function measureCommPerformance() {
  const startTime = performance.now();
  const numberOfRequests = 1000;
  let completedRequests = 0;

  for (let i = 0; i < numberOfRequests; i++) {
    distribution.local.comm.send([], { node: { ip: '127.0.0.1', port: 9009 }, service: 'testService', method: 'testMethod' }, (e, v) => {
      completedRequests++;
      if (completedRequests === numberOfRequests) {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const throughput = numberOfRequests / (totalTime / 1000);
        const averageLatency = totalTime / numberOfRequests;
        console.log(`Comm Performance:`);
        console.log(`Total Time: ${totalTime.toFixed(2)} ms`);
        console.log(`Throughput: ${throughput.toFixed(2)} requests/second`);
        console.log(`Average Latency: ${averageLatency.toFixed(2)} ms/request`);
      }
    });
  }
}

// Function to measure performance of rpc
async function measureRpcPerformance() {
  const startTime = performance.now();
  const numberOfRequests = 1000;
  let completedRequests = 0;

  const node = { ip: '127.0.0.1', port: 9009 };
  const addOneRPC = distribution.util.wire.createRPC(distribution.util.wire.toAsync(() => {}));

  const rpcService = {
    testMethod: addOneRPC,
  };

  let server;

  distribution.node.start((srv) => {
    server = srv; // Store the server instance for cleanup

    distribution.local.status.spawn(node, (e, v) => {
      if (e) {
        console.error('Error spawning node:', e);
        server.close();
        return;
      }

      distribution.local.comm.send([rpcService, 'testService'], { node: node, service: 'routes', method: 'put' }, (e, v) => {
        if (e) {
          console.error('Error installing service:', e);
          server.close();
          return;
        }

        for (let i = 0; i < numberOfRequests; i++) {
          distribution.local.comm.send([], { node: node, service: 'testService', method: 'testMethod' }, (e, v) => {
            completedRequests++;
            if (completedRequests === numberOfRequests) {
              const endTime = performance.now();
              const totalTime = endTime - startTime;
              const throughput = numberOfRequests / (totalTime / 1000);
              const averageLatency = totalTime / numberOfRequests;
              console.log(`RPC Performance:`);
              console.log(`Total Time: ${totalTime.toFixed(2)} ms`);
              console.log(`Throughput: ${throughput.toFixed(2)} requests/second`);
              console.log(`Average Latency: ${averageLatency.toFixed(2)} ms/request`);

              // Clean up the server
              server.close(() => {
                console.log('Server closed successfully.');
              });
            }
          });
        }
      });
    });
  });
}

// Run performance tests
measureCommPerformance();
measureRpcPerformance();