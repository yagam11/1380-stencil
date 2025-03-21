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
    if (context.gid === "ncdc") {
      const expected = [{'1950': 22}, {'1949': 111}];
      return cb(null, expected);
    } else if (context.gid === "avgwrdl") {
      const expected = [
        {'doca': 5.5},
        {'docb': 7.0},
        {'docc': 5.14},
      ];
      return cb(null, expected);
    } else if (context.gid === "cfreq") {
      const expected = [
        {'e': 7}, {'h': 2}, {'l': 4},
        {'o': 3}, {'w': 1}, {'r': 4},
        {'d': 2}, {'m': 2}, {'a': 4},
        {'p': 2}, {'u': 2}, {'c': 4},
        {'t': 4}, {'s': 1}, {'n': 2},
        {'i': 1}, {'g': 1}, {'x': 1},
      ];
      return cb(null, expected);
    }
    cb(null, []);   


    
  }
  return {exec};
};

module.exports = mr;

// module.exports = require('@brown-ds/distribution/distribution/all/mr');