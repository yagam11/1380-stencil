/** @typedef {import("../types").Callback} Callback */
const routes_table = {};

function get(configuration, callback = () => {}) {
  const service = configuration instanceof Object ? configuration.service : configuration;
  const gid = configuration instanceof Object ? (configuration.gid || 'local') : 'local';
  let error, config;

  try {
    if (gid === "local") {
      if (service in routes_table) {
        config = routes_table[service];
      } else if (global.toLocal && global.toLocal[service]) {
        config = { call: global.toLocal[service] };
      } else {
        throw new Error(`Service '${service}' not found in local routes`);
      }
    } else if (gid && global.distribution && global.distribution[gid]) {
      if (service in global.distribution[gid]) {
        config = global.distribution[gid][service];
      } else {
        throw new Error(`Service '${service}' not found in group '${gid}'`);
      }
    } else {
      throw new Error(`Invalid group ID '${gid}'`);
    }
  } catch (e) {
    error = e;
  }
  
  callback(error, config);
  return config;
}


function put(service, configuration, callback = () => {}) {
  routes_table[configuration] = service;
  callback(undefined, service);
}


function rem(configuration, callback = () => {}) {
  let error = undefined;
  if (configuration in routes_table) {
    Reflect.deleteProperty(routes_table, configuration);
  } else {
    error = new Error(`${configuration} doesn't exist!`);
  }
  callback(error, configuration);
}

module.exports = { get, put, rem };