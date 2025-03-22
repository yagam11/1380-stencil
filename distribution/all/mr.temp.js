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

  /**
   * @param {MRConfig} configuration
   * @param {Callback} cb
   * @return {void}
   */
  function exec(configuration, cb) {
    // mapper/reducer/keys imported
    const { map, reduce, keys } = configuration;
    // nodeInfo -- the orchestrator
    const nodeInfo = global.nodeConfig || { ip: 'unknown', port: 'unknown' };
    console.log(`[MapReduce Orchestrator] Running on ${nodeInfo.ip}:${nodeInfo.port}`);

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

  }
  return {exec};
};

module.exports = mr;
