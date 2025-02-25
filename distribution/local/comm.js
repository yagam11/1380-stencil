/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */

const log = require("../util/log");
const { serialize, deserialize } = require("../util/util");
const http = require("http");

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
    callback = callback || ((e, c) => e ? console.error(e) : console.log(c));
    let data = undefined;
    try {
        data = serialize(message);
    } catch (error) {
        throw error;
    }
    let { node: { ip, port }, service, method } = remote;
    if (service in message) {
        service = message.service;
    }
    let gid = remote.gid;
    if (gid in message) {
        gid = gid || message.gid;
    }
    gid = gid || "local";

    const options = {
        hostname: ip,
        port: port,
        method: 'PUT',
        path: `/${gid}/${service}/${method}`, // Updated path
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const req = http.request(options, (res) => {
        let responseData = [];

        res.on("data", (chunk) => {
          responseData.push(chunk);
        });
      
        res.on("end", () => {
            responseData = deserialize(responseData.join(''));
            // Handle conditions that failed
            if (res.statusCode !== 200) {
                console.error(responseData.error);
                callback(new Error(`Request failed: ${JSON.stringify(responseData.error)}`), responseData.data);
            } else {
                callback(responseData.error, responseData.data);
            }
        });
        res.on("error", err => console.error(err));
    });
    // Handle network errors
    req.on("error", (error) => {
        callback(error, undefined);
    });
    req.write(data);
    req.end();
}

module.exports = {send};