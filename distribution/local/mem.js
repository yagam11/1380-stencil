const id = require('../util/id');

const memStore = {}

function put(state, configuration, callback) {
  try {
    if (!state) {
      throw new Error("State (value) must be provided.");
    }

    let key = configuration; 
    const value = state;

    if (key === null) {
      key = id.getID(value);
    }
    memStore[key] = value; // Store key-value pair
    callback(null, value);
  } catch (error) {
    callback(error, null);
  }
};


function get(configuration, callback) {
  try {
    if (configuration === null) {
      return callback(null, Object.keys(memStore)); // Return a copy of the store
    }
    const key = configuration;

    if (!(key in memStore)) {
      throw new Error(`Key '${key}' not found.(get)`);
    }

    callback(null, memStore[key]);
  } catch (error) {
    callback(error, null);
  }
}

function del(configuration, callback) {
  try {
    if (!configuration) {
      throw new Error("Key must be provided for DEL.");
    }

    const key = configuration;

    if (!(key in memStore)) {
      throw new Error(`Key '${key}' not found.`);
    }

    const deletedValue = memStore[key];
    delete memStore[key];

    callback(null, deletedValue);
  } catch (error) {
    callback(error, null);
  }
};

// module.exports = {put, get, del};
module.exports = require('@brown-ds/distribution/distribution/local/mem');