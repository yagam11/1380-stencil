const distribution = require('../../config.js'); // Adjust the path as needed
const id = distribution.util.id;

// Define groups for existing and custom test cases
const ncdcGroup = {};
const avgwrdlGroup = {};
const cfreqGroup = {};
const customGroup = {}; // Group for custom test case 1
const custom2Group = {}; // Group for custom test case 2

/*
    The local node will be the orchestrator.
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 7110};
const n2 = {ip: '127.0.0.1', port: 7111};
const n3 = {ip: '127.0.0.1', port: 7112};

// Test Case 1: Similar to the existing ncdc test case
test('(1 pts) new.mr:ncdc', (done) => {
  const mapper = (key, value) => {
    const words = value.split(/(\s+)/).filter((e) => e !== ' ');
    const out = {};
    out[words[1]] = parseInt(words[3]);
    return [out];
  };

  const reducer = (key, values) => {
    const out = {};
    out[key] = values.reduce((a, b) => Math.max(a, b), -Infinity);
    return out;
  };

  const dataset = [
    {'000': '006701199099999 1950 0515070049999999N9 +0000 1+9999'},
    {'106': '004301199099999 1950 0515120049999999N9 +0022 1+9999'},
    {'212': '004301199099999 1950 0515180049999999N9 -0011 1+9999'},
    {'318': '004301265099999 1949 0324120040500001N9 +0111 1+9999'},
    {'424': '004301265099999 1949 0324180040500001N9 +0078 1+9999'},
  ];

  const expected = [{'1950': 22}, {'1949': 111}];

  const doMapReduce = (cb) => {
    distribution.ncdc.mr.exec({keys: getDatasetKeys(dataset), map: mapper, reduce: reducer}, (e, v) => {
      try {
        expect(v).toEqual(expect.arrayContaining(expected));
        done();
      } catch (e) {
        done(e);
      }
    });
  };

  let cntr = 0;
  dataset.forEach((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    distribution.ncdc.store.put(value, key, (e, v) => {
      cntr++;
      if (cntr === dataset.length) {
        doMapReduce();
      }
    });
  });
});

// Test Case 2: Similar to the existing avgwrdl test case
test('(1 pts) new.mr:avgwrdl', (done) => {
  const mapper = (key, value) => {
    const words = value.split(/\s+/).filter((e) => e !== '');
    const out = {};
    out[key] = {
      totalLength: words.reduce((sum, word) => sum + word.length, 0),
      wordCount: words.length,
    };
    return [out];
  };

  const reducer = (key, values) => {
    const totalLength = values.reduce((sum, v) => sum + v.totalLength, 0);
    const totalCount = values.reduce((sum, v) => sum + v.wordCount, 0);
    const avgLength = totalCount === 0 ? 0 : totalLength / totalCount;
    const out = {};
    out[key] = parseFloat(avgLength.toFixed(2));
    return out;
  };

  const dataset = [
    {'doca': 'short and simple sentence'},
    {'docb': 'another slightly longer example'},
    {'docc': 'the final example has various word lengths'},
  ];

  const expected = [
    {'doca': 5.5},
    {'docb': 7.0},
    {'docc': 5.14},
  ];

  const doMapReduce = (cb) => {
    distribution.avgwrdl.mr.exec({keys: getDatasetKeys(dataset), map: mapper, reduce: reducer}, (e, v) => {
      try {
        expect(v).toEqual(expect.arrayContaining(expected));
        done();
      } catch (e) {
        done(e);
      }
    });
  };

  let cntr = 0;

  dataset.forEach((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    distribution.avgwrdl.store.put(value, key, (e, v) => {
      cntr++;
      if (cntr === dataset.length) {
        doMapReduce();
      }
    });
  });
});

// Test Case 3: Similar to the existing cfreq test case
test('(1 pts) new.mr:cfreq', (done) => {
  const mapper = (key, value) => {
    const chars = value.replace(/\s+/g, '').split('');
    const out = [];
    chars.forEach((char) => {
      const o = {};
      o[char] = 1;
      out.push(o);
    });
    return out;
  };

  const reducer = (key, values) => {
    const out = {};
    out[key] = values.reduce((sum, v) => sum + v, 0);
    return out;
  };

  const dataset = [
    {'doc1': 'hello world'},
    {'doc2': 'map reduce test'},
    {'doc3': 'character counting example'},
  ];

  const expected = [
    {'h': 2}, {'e': 7}, {'l': 4},
    {'o': 3}, {'w': 1}, {'r': 4},
    {'d': 2}, {'m': 2}, {'a': 4},
    {'p': 2}, {'u': 2}, {'c': 4},
    {'t': 4}, {'s': 1}, {'n': 2},
    {'i': 1}, {'g': 1}, {'x': 1},
  ];

  const doMapReduce = (cb) => {
    distribution.cfreq.mr.exec({keys: getDatasetKeys(dataset), map: mapper, reduce: reducer}, (e, v) => {
      try {
        expect(v).toEqual(expect.arrayContaining(expected));
        done();
      } catch (e) {
        done(e);
      }
    });
  };

  let cntr = 0;

  dataset.forEach((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    distribution.cfreq.store.put(value, key, (e, v) => {
      cntr++;
      if (cntr === dataset.length) {
        doMapReduce();
      }
    });
  });
});

// Test Case 4: Custom test case using customGroup
test('(1 pts) new.mr:custom1', (done) => {
  // Define a custom mapper and reducer for this test case
  const mapper = (key, value) => {
    // Custom logic for mapping
    const out = {};
    out[key] = value.length; // Store the length of the document
    return [out];
  };

  const reducer = (key, values) => {
    // Custom logic for reducing
    const out = {};
    out[key] = values.reduce((a, b) => a + b, 0); // Sum the lengths
    return out;
  };

  const dataset = [
    {'doc1': 'This is a test document'},
    {'doc2': 'Another document for testing'},
    {'doc3': 'Yet another document'},
  ];

  const expected = [
    {'doc1': 23},
    {'doc2': 28},
    {'doc3': 20},
  ];

  const doMapReduce = (cb) => {
    distribution.custom.mr.exec({keys: getDatasetKeys(dataset), map: mapper, reduce: reducer}, (e, v) => {
      try {
        expect(v).toEqual(expect.arrayContaining(expected));
        done();
      } catch (e) {
        done(e);
      }
    });
  };

  let cntr = 0;

  dataset.forEach((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    distribution.custom.store.put(value, key, (e, v) => {
      cntr++;
      if (cntr === dataset.length) {
        doMapReduce();
      }
    });
  });
});

// Test Case 5: Custom test case using custom2Group
test('(1 pts) new.mr:custom2', (done) => {
  // Define a custom mapper and reducer for this test case
  const mapper = (key, value) => {
    // Custom logic for mapping
    const words = value.split(/\s+/).filter((e) => e !== '');
    const out = {};
    out[key] = words.length; // Count the number of words
    return [out];
  };

  const reducer = (key, values) => {
    // Custom logic for reducing
    const out = {};
    out[key] = values.reduce((a, b) => a + b, 0); // Sum the word counts
    return out;
  };

  const dataset = [
    {'doc1': 'This is a test document'},
    {'doc2': 'Another document for testing'},
    {'doc3': 'Yet another document'},
  ];

  const expected = [
    {'doc1': 5},
    {'doc2': 4},
    {'doc3': 3},
  ];

  const doMapReduce = (cb) => {
    distribution.custom2.mr.exec({keys: getDatasetKeys(dataset), map: mapper, reduce: reducer}, (e, v) => {
      try {
        expect(v).toEqual(expect.arrayContaining(expected));
        done();
      } catch (e) {
        done(e);
      }
    });
  };

  let cntr = 0;

  dataset.forEach((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    distribution.custom2.store.put(value, key, (e, v) => {
      cntr++;
      if (cntr === dataset.length) {
        doMapReduce();
      }
    });
  });
});

/*
    Test setup and teardown
*/

// Helper function to extract keys from dataset
function getDatasetKeys(dataset) {
  return dataset.map((o) => Object.keys(o)[0]);
}

beforeAll((done) => {
  // Populate existing groups
  ncdcGroup[id.getSID(n1)] = n1;
  ncdcGroup[id.getSID(n2)] = n2;
  ncdcGroup[id.getSID(n3)] = n3;

  avgwrdlGroup[id.getSID(n1)] = n1;
  avgwrdlGroup[id.getSID(n2)] = n2;
  avgwrdlGroup[id.getSID(n3)] = n3;

  cfreqGroup[id.getSID(n1)] = n1;
  cfreqGroup[id.getSID(n2)] = n2;
  cfreqGroup[id.getSID(n3)] = n3;

  // Populate custom groups
  customGroup[id.getSID(n1)] = n1;
  customGroup[id.getSID(n2)] = n2;
  customGroup[id.getSID(n3)] = n3;

  custom2Group[id.getSID(n1)] = n1;
  custom2Group[id.getSID(n2)] = n2;
  custom2Group[id.getSID(n3)] = n3;

  const startNodes = (cb) => {
    distribution.local.status.spawn(n1, (e, v) => {
      distribution.local.status.spawn(n2, (e, v) => {
        distribution.local.status.spawn(n3, (e, v) => {
          cb();
        });
      });
    });
  };

  distribution.node.start((server) => {
    localServer = server;

    const ncdcConfig = {gid: 'ncdc'};
    const avgwrdlConfig = {gid: 'avgwrdl'};
    const cfreqConfig = {gid: 'cfreq'};
    const customConfig = {gid: 'custom'}; // Configuration for customGroup
    const custom2Config = {gid: 'custom2'}; // Configuration for custom2Group

    startNodes(() => {
      distribution.local.groups.put(ncdcConfig, ncdcGroup, (e, v) => {
        distribution.ncdc.groups.put(ncdcConfig, ncdcGroup, (e, v) => {
          distribution.local.groups.put(avgwrdlConfig, avgwrdlGroup, (e, v) => {
            distribution.avgwrdl.groups.put(avgwrdlConfig, avgwrdlGroup, (e, v) => {
              distribution.local.groups.put(cfreqConfig, cfreqGroup, (e, v) => {
                distribution.cfreq.groups.put(cfreqConfig, cfreqGroup, (e, v) => {
                  // Configure customGroup
                  distribution.local.groups.put(customConfig, customGroup, (e, v) => {
                    distribution.custom.groups.put(customConfig, customGroup, (e, v) => {
                      // Configure custom2Group
                      distribution.local.groups.put(custom2Config, custom2Group, (e, v) => {
                        distribution.custom2.groups.put(custom2Config, custom2Group, (e, v) => {
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

afterAll((done) => {
  const remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        localServer.close();
        done();
      });
    });
  });
});