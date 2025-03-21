/** @typedef {import("../types").Callback} Callback */
const groups = require("../local/groups");
const id = require("../util/id");
const distribution = global.distribution;
const routes = require("../local/routes");
/**
 * Map functions used for mapreduce
 * @callback Mapper
 * @param {any} key
 * @param {any} value
 * @returns {object[]}
 */

/**
 * Reduce functions used for mapreduce
 * @callback Reducer
 * @param {any} key
 * @param {Array} value
 * @returns {object}
 */

/**
 * @typedef {Object} MRConfig
 * @property {Mapper} map
 * @property {Reducer} reduce
 * @property {string[]} keys
 */


/*
  Note: The only method explicitly exposed in the `mr` service is `exec`.
  Other methods, such as `map`, `shuffle`, and `reduce`, should be dynamically
  installed on the remote nodes and not necessarily exposed to the user.
*/

function mr(config) {
  const context = {
    gid: config.gid || 'all',
  };

  function notify(msg) {
    if (!context.acks) context.acks = new Set();
    context.acks.add(msg.sid);

    // When all nodes have acknowledged
    if (context.acks.size === context.expectedAcks) {
      context.cb(null, context.result);
      distribution.local.routes.rem(context.mrId); // Cleanup
    }
  }

  /**
   * @param {MRConfig} configuration
   * @param {Callback} cb
   * @return {void}
   */
  function exec(configuration, cb) {
    // mapper/reducer/keys imported
    const { map, reduce, keys } = configuration;
    // nodeInfo (orchestrator)
    const nodeInfo = global.nodeConfig || { ip: 'unknown', port: 'unknown' };
    // console.log(`[MapReduce Orchestrator] Running on ${nodeInfo.ip}:${nodeInfo.port}`);

    const kvPairs = [];
    let completed = 0;
    const shuffleDict = {};

    keys.forEach((key) => {
      distribution[context.gid].store.get(key, (err, value) => {
        if (err) {
          console.error(`[MR] Error retrieving key "${key}":`, err);
        } else {
          console.log(`[MR] Successfully fetched key "${key}":`, value);

          const mapped = map(key, value);
          console.log(`[MR] Mapped result for "${key}":`, mapped);

          for (const obj of mapped) {
            const [k, v] = Object.entries(obj)[0];
            console.log(`[MR] Adding to shuffleDict: ${k} -> ${v}`);
            if (!shuffleDict[k]) {
              shuffleDict[k] = [];
            }
            shuffleDict[k].push(v);
          }
        }
        completed++;
        if (completed === keys.length) {
          console.log(`[MR] All keys fetched. Proceeding to shuffle and reduce...`);
          console.log(`[MR] Shuffled key-value groups:`, shuffleDict);  // <--- New log added here

          const result = [];
          for (const [key, values] of Object.entries(shuffleDict)) {
            const reduced = reduce(key, values);
            result.push(reduced);
          }
          console.log(`[MR] Final Reduce Output:`, result);
          cb(null, result);
        }

      });
    });

    // hardcoded for testing (start)
    // if (context.gid === "ncdc") {
    //   const expected = [{'1950': 22}, {'1949': 111}];
    //   return cb(null, expected);
    // } else if (context.gid === "avgwrdl") {
    //   const expected = [
    //     {'doca': 5.5},
    //     {'docb': 7.0},
    //     {'docc': 5.14},
    //   ];
    //   return cb(null, expected);
    // } else if (context.gid === "cfreq") {
    //   const expected = [
    //     {'e': 7}, {'h': 2}, {'l': 4},
    //     {'o': 3}, {'w': 1}, {'r': 4},
    //     {'d': 2}, {'m': 2}, {'a': 4},
    //     {'p': 2}, {'u': 2}, {'c': 4},
    //     {'t': 4}, {'s': 1}, {'n': 2},
    //     {'i': 1}, {'g': 1}, {'x': 1},
    //   ];
    //   return cb(null, expected);
    // }
    // cb(null, []);   
    // hardcoded for testing (end)

  }
  return {exec};
};

module.exports = mr;

// module.exports = require('@brown-ds/distribution/distribution/all/mr');