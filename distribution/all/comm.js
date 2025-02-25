/** @typedef {import("../types").Callback} Callback */

const groups = require("../local/groups");

const comm = (config) => {
  const context = {
    gid: config.gid ?? 'all'
  };

  const send = async (message, configuration, callback) => {
    try {
      const group = groups.get(context.gid, (_, value) => {});
      const nodeIds = Object.keys(group);

      let pending = nodeIds.length;
      const results = {
        errors: {},
        responses: {}
      };

      if (pending === 0) {
        callback({}, {});
        return;
      }

      nodeIds.forEach((nodeId) => {
        const remote = {
          node: group[nodeId],
          service: configuration.service,
          method: configuration.method
        };

        global.distribution.local.comm.send(message, remote, (err, res) => {
          if (err) {
            results.errors[nodeId] = err;
          } else {
            results.responses[nodeId] = res;
          }

          if (--pending === 0) {
            callback(results.errors, results.responses);
          }
        });
      });
    } catch (error) {
      callback({ general: error }, {});
    }
  };

  return { send };
};

// module.exports = comm;
module.exports = require('@brown-ds/distribution/distribution/all/comm');