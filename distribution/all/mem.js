const distribution = global.distribution;

function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;
  /* For the distributed mem service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      try {
        const kid = global.distribution.util.id.getID(configuration);
        const nids = Object.keys(global.distribution[context.gid]);
        const responsibleNode = context.hash(kid, nids); // Hashing selects the node

        // console.log(`GET: Routing key '${configuration}' (KID: ${kid}) to node ${responsibleNode}`);

        distribution[context.gid].comm.send(responsibleNode, { service: "mem", method: "get", key: configuration }, callback);
      } catch (error) {
        callback(error, null);
      }
    },

    put: (state, configuration, callback) => {
      try {
        let key = configuration;
        if (key === null) {
          key = global.distribution.util.id.getID(state); // Generate KID if no key is provided
        }

        const kid = global.distribution.util.id.getID(key); // Compute KID (SHA-256 of key)
        const nids = Object.keys(global.distribution[context.gid]); // Get node list
        const responsibleNode = context.hash(kid, nids); // Select the responsible node

        distribution[context.gid].comm.send(responsibleNode, { service: "mem", method: "put", key, value: state }, callback);
      } catch (error) {
        callback(error, null);
      }
    },

    del: (configuration, callback) => {
      try {
        const kid = global.distribution.util.id.getID(configuration); // Compute KID (SHA-256 of key)
        const nids = Object.keys(global.distribution[context.gid]); // Get node list
        const responsibleNode = context.hash(kid, nids); // Select the responsible node

        // console.log(`DEL: Deleting key '${configuration}' (KID: ${kid}) from node ${responsibleNode}`);

        distribution[context.gid].comm.send(responsibleNode, { service: "mem", method: "del", key: configuration }, callback);
      } catch (error) {
        callback(error, null);
      }
    },

    reconf: (configuration, callback) => {
    },
  };
};

// module.exports = mem;
module.exports = require('@brown-ds/distribution/distribution/all/mem');