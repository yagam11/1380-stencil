// const { id } = require('@brown-ds/distribution/distribution/util/util');

// const groupSet = {}; // Object to store groups (instead of Map)
// const groups = {};

// groups.get = function (name, callback = () => {}) {
//   try {
//     if (!(name in groupSet)) {
//       throw new Error(`Group '${name}' does not exist`);
//     }
//     const result = groupSet[name];
//     callback(null, result);
//     return result;
//   } catch (error) {
//     callback(error, null);
//     return null;
//   }
// };

// groups.put = function (config, group, callback = () => {}) {
//   group = group || {};
//   if (typeof config === 'string') {
//     config = { gid: config };
//   }

//   groupSet[config.gid] = group;

//   if (!global.groupsStore) {
//     global.groupsStore = { all: {} };
//   }

//   Object.keys(group).forEach((node) => {
//     global.groupsStore['all'][id.getSID(group[node])] = group[node];
//   });
//   // if (!global.distribution) {
//   //   global.distribution = {};
//   // }
//   global.distribution[config.gid] = {};

//   global.distribution[config.gid] = {
//     status: require('../all/status')(config),
//     comm: require('../all/comm')(config),
//     gossip: require('../all/gossip')(config),
//     groups: require('../all/groups')(config),
//     routes: require('../all/routes')(config),
//     mem: require('../all/mem')(config),
//     store: require('../all/store')(config),
//     mr: require('../all/mr')(config),
//   };

//   callback(null, group);
// };

// groups.del = function (name, callback = () => {}) {
//   try {
//     if (!(name in groupSet)) {
//       throw new Error(`Group '${name}' does not exist`);
//     }
//     const result = groupSet[name];
//     delete groupSet[name];
//     callback(null, result);
//   } catch (error) {
//     callback(error, null);
//   }
// };

// groups.add = function (name, node, callback = (error, value) => {
//   if (error) console.error(error);
//   else console.log(value);
// }) {
//   if (!(name in groupSet)) {
//     groupSet[name] = {}; // Initialize empty group if it doesn't exist
//   }
//   const grp = groupSet[name];
//   const sid = id.getSID(node);
//   grp[sid] = node;
//   callback(null, node);
// };

// groups.rem = function (name, node, callback = (error, value) => {
//   if (error) console.error(error);
//   else console.log(value);
// }) {
//   if (!(name in groupSet)) {
//     return callback(new Error(`Group '${name}' does not exist`), null);
//   }
//   const grp = groupSet[name];

//   if (grp[node] !== undefined) {
//     delete grp[node];  // remove from the group object
//     callback(null, node);
//   } else {
//     callback(null, null);
//   }
// };

const id = require('../util/id');
const { group } = require('yargs');

const groupsStore = {};
groupsStore['all'] = {};

const groups = {};

groups.get = function (name, callback) {
  callback = callback || (() => {});
  if (name in groupsStore) {
    callback(null, groupsStore[name]);
  } else {
    const error = new Error(`Group '${name}' does not exist`);
    callback(error, null);
  }
};

groups.put = function (config, group, callback) {
  group = group || {};
  if (typeof config === 'string') {
    config = { gid: config };
  }
  groupsStore[config.gid] = group;
  Object.keys(group).forEach((node) => {
    groupsStore['all'][id.getSID(group[node])] = group[node];
  });

  global.distribution[config.gid] = {
    status: require('../all/status')(config),
    comm: require('../all/comm')(config),
    gossip: require('../all/gossip')(config),
    groups: require('../all/groups')(config),
    routes: require('../all/routes')(config),
    mem: require('../all/mem')(config),
    store: require('../all/store')(config),
    mr: require('../all/mr')(config),
  };
  callback(null, group);
}

groups.del = function (name, callback) {
  if (name in groupsStore) {
    const result = groupsStore[name];
    delete groupsStore[name];
    callback(null, result);
  } else {
    const error = new Error(`Group '${name}' does not exist`);
    callback(error, null);
  }
};

groups.add = function (name, node, callback) {
  callback = callback || (() => {});
  if (name in groupsStore){
    if (!(name in groupsStore)) {
      groupsStore[name] = {}; // Initialize empty group if it doesn't exist
    }
  }
  groupsStore[name][id.getSID(node)] = node;
  groupsStore['all'][id.getSID(node)] = node;
  if (callback) {
    callback(null, groupsStore[name]);
  } else {
    if (callback) {
      callback(new Error(`Group '${name}' does not exist`), null);
    }
  }
}

groups.rem = function (name, node, callback) {
  callback = callback || (() => {});
  if (name in groupsStore) {
    delete groupsStore[name][node];
    delete groupsStore['all'][node];
    callback(null, groupsStore[name]);
  } else {
    callback(new Error(`Node '${node}' not found in group '${name}'`), null);
  }
};

module.exports = groups;