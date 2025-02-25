const http = require('http');
const url = require('url');
const log = require('../util/log');
const { routes } = require('./local');
const { deserialize, serialize } = require('../util/util');

const start = function(callback = () => {}) {
  const server = http.createServer((req, res) => {
    if (req.method !== "PUT") {
      // Handle other HTTP methods
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }

    const url_ = url.parse(req.url);
    const pathSegments = url_.pathname.split('/').filter(segment => segment); // Remove empty segments

    // Ensure we have enough segments before accessing indices to prevent runtime errors
    const gid = pathSegments[0]; // Default to "local" if missing
    const service = pathSegments[1];
    const method_name = pathSegments[2];

    // Handle cases where service or method are missing
    if (!service || !method_name) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid request format: missing service or method' }));
    }

    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk.toString());
    });

    req.on('end', () => {
      try {
        const params = deserialize(body.join(''));
        const configuration = { service: service, gid: gid };

        // Use the callback to retrieve the service object
        routes.get(configuration, (error, serviceObj) => {
          if (error) {
            throw new Error(`Service not found: ${service}`);
          }

          if (!serviceObj) {
            throw new Error(`Service not found: ${service}`);
          }

          const method = serviceObj[method_name];
          if (typeof method !== 'function') {
            throw new Error(`Method ${method_name} not found on service ${service}`);
          }

          method(...params, (error, result) => {
            const response = { error: error, data: result };
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(serialize(response));
          });
        });
      } catch (error) {
        const errorResponse = { error: error.message, data: null };
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(serialize(errorResponse));
      }
    });
  });

  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    global.distribution.node.server = server;
    callback(server);
  });

  server.on('error', (error) => {
    throw error;
  });
};

module.exports = {
  start: start,
};