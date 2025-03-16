const distribution = global.distribution;
const groups = require("../local/groups");

function store(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;

  /* For the distributed store service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      let key = configuration;
      const kid = distribution.util.id.getID(key); // Compute the key ID

      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }

        const nids = Object.keys(group); // Get the list of node IDs in the group
        if (nids.length === 0) {
          return callback(new Error(`No nodes available in group '${context.gid}'.`), null);
        }

        const responsibleNode = context.hash(kid, nids);

        const remote = {
          node: group[responsibleNode], // The responsible node
          service: "store", method: "get", // The method to call
        };

        // Send the request to the responsible node
        distribution.local.comm.send([configuration], remote, callback);
      });
    },

    put: (state, configuration, callback) => {
      let key = configuration;
      const kid = distribution.util.id.getID(key); // Compute the key ID

      // Get the group to determine the responsible node
      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }

        const nids = Object.keys(group); // Get the list of node IDs in the group
        if (nids.length === 0) {
          return callback(new Error(`No nodes available in group '${context.gid}'.`), null);
        }

        // Determine the responsible node
        const responsibleNode = context.hash(kid, nids);

        const remote = {
          node: group[responsibleNode], // The responsible node
          service: "store", method: "put", // The method to call
        };

        distribution.local.comm.send([state, configuration], remote, callback);
      });
    },

    del: (configuration, callback) => {
      let key = configuration;
      const kid = distribution.util.id.getID(key); // Compute the key ID

      // Get the group to determine the responsible node
      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }

        const nids = Object.keys(group); // Get the list of node IDs in the group
        if (nids.length === 0) {
          return callback(new Error(`No nodes available in group '${context.gid}'.`), null);
        }

        const responsibleNode = context.hash(kid, nids);
        // console.log(`Routing key '${key}' (KID: ${kid}) to node ${responsibleNode}`);

        const remote = {
          node: group[responsibleNode], // The responsible node
          service: "store", method: "del", // The method to call
        };

        distribution.local.comm.send([configuration], remote, callback);
      });
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = store;
// module.exports = require('@brown-ds/distribution/distribution/all/store');