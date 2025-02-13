/** @typedef {import("../types").Callback} Callback */

const routes = {};
const services = {};

/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
  callback = callback || function() {}; // Ensure callback exists

  if (services.hasOwnProperty(configuration)) {
    callback(null, services[configuration]); // Return the service
  } else {
    callback(new Error(`Service '${configuration}' does not exist`), null);
  }
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
  callback = callback || function() {}; // Ensure callback exists

  if (!service || typeof service !== "object") {
    return callback(new Error("Invalid service object"), null);
  }

  services[configuration] = service;
  callback(null, `Service '${configuration}' registered successfully`);
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
  callback = callback || function() {}; // Ensure callback exists

  if (services.hasOwnProperty(configuration)) {
    delete services[configuration];
    callback(null, `Service '${configuration}' removed successfully`);
  } else {
    callback(new Error(`Service '${configuration}' does not exist`), null);
  }
};

module.exports = {get, put, rem};
