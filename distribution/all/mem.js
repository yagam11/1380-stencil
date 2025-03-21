const distribution = global.distribution;
const groups = require("../local/groups");

function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;
  /* For the distributed mem service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      let key = configuration;
      const kid = distribution.util.id.getID(key);
      
      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }
        const nids = Object.keys(group);
        const responsibleNode = context.hash(kid, nids);
        // console.log(group, configuration)
        const remote = {
          node: group[responsibleNode], // The responsible node
          service: "mem", method: "get",
        };
    
        distribution.local.comm.send([configuration], remote, callback);
      });
    },

    put: (state, configuration, callback) => {
      const kid = distribution.util.id.getID(configuration);
      // if (configuration === null) {
      //   kid = distribution.util.id.getID(state);
      // }

      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }
        // console.log(context.gid, group);
        const nids = Object.keys(group); 
        const responsibleNode = context.hash(kid, nids);
    
        const remote = {
          node: group[responsibleNode],
          service: "mem", method: "put", 
          // gid: context.gid // The group ID
        };
      
        // Send the request to the responsible node
        distribution.local.comm.send([state, configuration], remote, callback);
      });
    },

    del: (configuration, callback) => {
      let key = configuration;
      const kid = distribution.util.id.getID(key);
      
      groups.get(context.gid, (err, group) => {
        if (err) {
          return callback(err, null);
        }
        const nids = Object.keys(group); 
        const responsibleNode = context.hash(kid, nids);
    
        const remote = {
          node: group[responsibleNode],
          service: "mem", method: "del", 
          // gid: context.gid // The group ID
        };
      
        // Send the request to the responsible node
        distribution.local.comm.send([configuration], remote, callback);
      });
    },

    reconf: (configuration, callback) => {
    },
  };
};

// module.exports = mem;
module.exports = require('@brown-ds/distribution/distribution/all/mem');