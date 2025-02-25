const distribution = global.distribution;

const groups = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    put: (config, group, callback) => {
      distribution[context.gid].comm.send([config, group], { service: "groups", method: "put", gid: context.gid }, callback);
    },

    del: (name, callback) => {
      distribution[context.gid].comm.send([name], { service: "groups", method: "del", gid: context.gid }, callback);
    },

    get: (name, callback) => {
      distribution[context.gid].comm.send([name], { service: "groups", method: "get", gid: context.gid }, callback);
    },

    add: (name, node, callback) => {
      distribution[context.gid].comm.send([name, node], { service: "groups", method: "add", gid: context.gid }, callback);
    },

    rem: (name, node, callback) => {
      distribution[context.gid].comm.send([name, node], { service: "groups", method: "rem", gid: context.gid }, callback);
    },
  };
};

// module.exports = groups;
// module.exports = require('@brown-ds/distribution/distribution/all/groups');