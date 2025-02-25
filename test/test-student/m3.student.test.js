/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Important: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
const id = distribution.util.id;
const local = distribution.local;

test('(1 pts) student test: Send a message to a non-existent method and expect an error', (done) => {
  const remote = {
    node: { ip: '127.0.0.1', port: 9000 }, // Replace with actual node IP and port
    service: 'status',
    method: 'nonExistentMethod',
  };

  // Send a message to a non-existent method
  distribution.local.comm.send(['nid'], remote, (e, v) => {
    expect(e).toBeDefined(); // Expect an error
    done();
  });
});

test('(2 pts) local.groups.put/get/del/get(browncs)', (done) => {
  const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.local.groups.put('browncs', g, (e, v) => {
    distribution.local.groups.get('browncs', (e, v) => {
      distribution.local.groups.del('browncs', (e, v) => {
        distribution.local.groups.get('browncs', (e, v) => {
          try {
            expect(e).toBeDefined();
            expect(e).toBeInstanceOf(Error);
            expect(v).toBeFalsy();
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });
});


test('(1 pts) student test: Send a message to a non-existent service and expect an error', (done) => {
  const remote = {
    node: { ip: '127.0.0.1', port: 9000 }, // Replace with actual node IP and port
    service: 'nonExistentService',
    method: 'get',
  };

  // Send a message to a non-existent service
  distribution.local.comm.send(['nid'], remote, (e, v) => {
    expect(e).toBeDefined(); // Expect an error
    done();
  });
});

test('(1 pts) student test: Send a message to a non-existent method and expect an error', (done) => {
  const remote = {
    node: { ip: '127.0.0.1', port: 9000 }, // Replace with actual node IP and port
    service: 'status',
    method: 'nonExistentMethod',
  };

  // Send a message to a non-existent method
  distribution.local.comm.send(['nid'], remote, (e, v) => {
    expect(e).toBeDefined(); // Expect an error
    done();
  });
});

test('(2 pts) local.groups.put/get/del/get(browncs)', (done) => {
  const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.local.groups.put('browncs', g, (e, v) => {
    distribution.local.groups.get('browncs', (e, v) => {
      distribution.local.groups.del('browncs', (e, v) => {
        distribution.local.groups.get('browncs', (e, v) => {
          try {
            expect(e).toBeDefined();
            expect(e).toBeInstanceOf(Error);
            expect(v).toBeFalsy();
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });
});
