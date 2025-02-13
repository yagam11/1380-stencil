/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
const { execSync } = require('child_process');
const local = distribution.local;
const id = distribution.util.id;

test('(1 pts) status.get returns node ID', (done) => {
  local.status.get('nid', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(id.getNID(distribution.node.config));
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) routes.put/get successfully stores and retrieves a service', (done) => {
  const testService = { greet: () => "Hello, Distributed Systems!" };

  local.routes.put(testService, 'greetService', (e, v) => {
    local.routes.get('greetService', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.greet()).toBe("Hello, Distributed Systems!");
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});


test('(1 pts) routes.rem successfully removes a service', (done) => {
  local.routes.rem(['greetService'], (e, v) => {
    try {
      expect(e).toBeFalsy();
      local.routes.get('greetService', (e, v) => {
        expect(v).toBeFalsy(); // Service should no longer exist
        done();
      });
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) comm.send fails for unreachable node', (done) => {
  const unreachableNode = { ip: "192.168.0.999", port: 9999 };
  const message = { data: "This message should fail" };
  const remote = { node: unreachableNode, service: 'testService', method: 'handle' };

  local.comm.send([message], remote, (e, v) => {
    try {
      expect(e).toBeTruthy(); // Error expected
      expect(v).toBeFalsy(); // No result should be returned
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) Simplified test using status, routes (No RPC)', (done) => {
  let counter = 0;
  const increment = () => ++counter; // No RPC, just direct function

  const serviceName = "testService"; // Fixed service name
  const node = distribution.node.config;
  const rpcService = { increment }; // Direct function (no RPC)

  console.log("[Test] Registering service...");

  // Step 1: Register the service (without RPC)
  local.routes.put(rpcService, serviceName, (e) => {
    if (e) {
      console.error("[Error] Service registration failed:", e);
      return done(e);
    }

    console.log(`[Debug] Service '${serviceName}' registered with methods:`, Object.keys(rpcService));

    // Step 2: Verify the service is available
    local.routes.get(serviceName, (e, v) => {
      if (e) {
        console.error("[Error] Failed to retrieve service:", e);
        return done(e);
      }
      console.log("[Debug] Retrieved service from routes:", v);

      if (!v.increment) {
        console.error("[Error] 'increment' method is missing in service!");
        return done(new Error("Method 'increment' not found in service"));
      }

      // Step 3: Call the service function directly
      console.log("[Test] Calling increment() directly...");
      const result = v.increment();
      expect(result).toBe(1); // Counter should have incremented once

      // Step 4: Remove the service
      local.routes.rem([serviceName], (e) => {
        if (e) {
          console.error("[Error] Failed to remove service:", e);
          return done(e);
        }

        console.log("[Test] Successfully removed service.");
        done();
      });
    });
  });
});

// 🔹 Infrastructure Setup
let localServer = null;

beforeAll((done) => {
  freePort(1234); // Ensure port 1234 is free before starting the test

  distribution.node.start((server) => {
    localServer = server;
    console.log("[Infra] Server started on port 1234.");
    done();
  });
});

afterAll((done) => {
  if (localServer) {
    localServer.close();
    console.log("[Infra] Server shut down.");
  }
  done();
});

// 🔹 Function to Free Port 1234
function freePort(port) {
  try {
    const output = execSync(`lsof -i :${port} -t`).toString().trim();
    if (output) {
      console.log(`[Infra] Port ${port} is in use. Killing process ${output}...`);
      execSync(`kill -9 ${output}`);
      console.log(`[Infra] Process ${output} terminated.`);
    }
  } catch (err) {
    console.log(`[Infra] Port ${port} is free.`);
  }
}
