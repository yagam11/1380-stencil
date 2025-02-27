/* Notes/Tips:

- Use absolute paths to make sure they are agnostic to where your code is running from!
  Use the `path` module for that.
*/
const fs = require('fs');
const path = require('path');
const id = require('../util/id');
const { serialize, deserialize } = require('../util/util');

const STORE_DIR = path.resolve(__dirname, '../store_data'); // Ensures absolute path

// Ensure the directory exists
if (!fs.existsSync(STORE_DIR)) {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

function sanitizeKey(key) {
  return key.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric characters with "_"
}

function put(state, configuration, callback) {
  try {
    if (!state) {
      throw new Error("State (value) must be provided.");
    }

    let key = configuration;
    if (key === null) {
      key = id.getID(state); // Generate key if null
    }
    const safeKey = sanitizeKey(key);
    const filePath = path.join(STORE_DIR, safeKey);
    // console.log('state', state, 'key', key);

    fs.writeFile(filePath, serialize(state), 'utf8', (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, state);
      }
    });
  } catch (error) {
    callback(error, null);
  }
}

function get(configuration, callback) {
  try {
    if (configuration === null) {
      const allKeys = fs.readdirSync(STORE_DIR).map((file) => file);
      return callback(null, allKeys);
    }

    const safeKey = sanitizeKey(configuration);
    const filePath = path.join(STORE_DIR, safeKey);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Key '${configuration}' not found.`);
    }

    const data = fs.readFileSync(filePath, 'utf8'); // Read file
    callback(null, deserialize(data)); // Deserialize and return object
  } catch (error) {
    callback(error, null);
  }
}

function del(configuration, callback) {
  try {
    if (!configuration) {
      throw new Error("Key must be provided for DEL.");
    }

    const safeKey = sanitizeKey(configuration);
    const filePath = path.join(STORE_DIR, safeKey);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Key '${configuration}' not found.`);
    }

    const deletedData = fs.readFileSync(filePath, 'utf8');
    fs.unlinkSync(filePath); // Delete file

    callback(null, deserialize(deletedData)); // Return deleted object
  } catch (error) {
    callback(error, null);
  }
}

module.exports = {put, get, del};
// module.exports = require('@brown-ds/distribution/distribution/local/store');

