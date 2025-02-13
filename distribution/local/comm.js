/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */


const http = require('http');

/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message, remote, callback) {
  callback = callback || function() {}; // Ensure callback exists

  if (!remote || !remote.node || !remote.service || !remote.method) {
    return callback(new Error("Invalid remote target information"), null);
  }

  let payload;
  try {
    payload = JSON.stringify({ args: message });
  } catch (error) {
    return callback(new Error("Failed to serialize message"), null);
  }

  const path = `/${remote.service}/${remote.method}`;

  const options = {
    hostname: remote.node.ip,
    port: remote.node.port,
    path: path,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const parsedResponse = JSON.parse(responseData);
        if (parsedResponse.error) {
          callback(new Error(parsedResponse.error), null);
        } else {
          callback(null, parsedResponse.result);
        }
      } catch (error) {
        callback(new Error("Failed to parse response"), null);
      }
    });
  });

  req.on('error', (error) => {
    callback(new Error(`Communication error: ${error.message}`), null);
  });

  req.write(payload);
  req.end();
}

module.exports = {send};
