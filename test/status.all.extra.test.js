const distribution = require('../config.js');
const id = distribution.util.id;

test('(10 pts) all.status.spawn/stop()', (done) => {
  // Spawn a node
  const nodeToSpawn = {ip: '127.0.0.1', port: 8008};

  // Spawn the node
  distribution.group4.status.spawn(nodeToSpawn, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v.ip).toEqual(nodeToSpawn.ip);
      expect(v.port).toEqual(nodeToSpawn.port);
    } catch (error) {
      done(error);
    }
    let remote = {node: nodeToSpawn, service: 'status', method: 'get'};

    // Ping the node, it should respond
    distribution.local.comm.send(['nid'], remote, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(id.getNID(nodeToSpawn));
      } catch (error) {
        done(error);
      }

      distribution.local.groups.get('group4', (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v[id.getSID(nodeToSpawn)]).toBeDefined();
        } catch (error) {
          done(error);
        }

        remote = {node: nodeToSpawn, service: 'status', method: 'stop'};

        // Stop the node
        distribution.local.comm.send([], remote, (e, v) => {
          try {
            expect(e).toBeFalsy();
            expect(v.ip).toEqual(nodeToSpawn.ip);
            expect(v.port).toEqual(nodeToSpawn.port);
          } catch (error) {
            done(error);
          }
          remote = {node: nodeToSpawn, service: 'status', method: 'get'};

          // Ping the node again, it shouldn't respond
          distribution.local.comm.send(['nid'],
              remote, (e, v) => {
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
});


// This group is used for testing most of the functionality
const mygroupGroup = {};
// This group is used for {adding,removing} {groups,nodes}
const group4Group = {};

/*
   This hack is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 8000};
const n2 = {ip: '127.0.0.1', port: 8001};
const n3 = {ip: '127.0.0.1', port: 8002};
const n4 = {ip: '127.0.0.1', port: 8003};
const n5 = {ip: '127.0.0.1', port: 8004};
const n6 = {ip: '127.0.0.1', port: 8005};


beforeAll((done) => {
  // First, stop the nodes if they are running
  const remote = {service: 'status', method: 'stop'};

  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n4;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n5;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n6;
            distribution.local.comm.send([], remote, (e, v) => {
            });
          });
        });
      });
    });
  });

  mygroupGroup[id.getSID(n1)] = n1;
  mygroupGroup[id.getSID(n2)] = n2;
  mygroupGroup[id.getSID(n3)] = n3;

  group4Group[id.getSID(n1)] = n1;
  group4Group[id.getSID(n2)] = n2;
  group4Group[id.getSID(n4)] = n4;

  // Now, start the base listening node
  distribution.node.start((server) => {
    localServer = server;

    const groupInstantiation = (e, v) => {
      const mygroupConfig = {gid: 'mygroup'};
      const group4Config = {gid: 'group4'};

      // Create some groups
      distribution.local.groups
          .put(mygroupConfig, mygroupGroup, (e, v) => {
            distribution.local.groups
                .put(group4Config, group4Group, (e, v) => {
                  distribution.group4.groups.put(group4Config, group4Group, (e, v) => {
                    done();
                  });
                });
              });
    };

    // Start the nodes
    distribution.local.status.spawn(n1, (e, v) => {
      distribution.local.status.spawn(n2, (e, v) => {
        distribution.local.status.spawn(n3, (e, v) => {
          distribution.local.status.spawn(n4, (e, v) => {
            distribution.local.status.spawn(n5, (e, v) => {
              distribution.local.status.spawn(n6, groupInstantiation);
            });
          });
        });
      });
    });
  });
});

afterAll((done) => {
  distribution.mygroup.status.stop((e, v) => {
    const remote = {service: 'status', method: 'stop'};
    remote.node = n1;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n2;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n3;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n4;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n5;
            distribution.local.comm.send([], remote, (e, v) => {
              remote.node = n6;
              distribution.local.comm.send([], remote, (e, v) => {
                localServer.close();
                done();
              });
            });
          });
        });
      });
    });
  });
});


