const distribution = require('@brown-ds/distribution');
const id = distribution.util.id;
const log = distribution.util.log;
// Initialize the status service
distribution.local.status = {
  get: function(key, callback = () => {}) {
      if (key === 'nid') {
          callback(null, id.getNID(node));
      } else if (key === 'sid') {
          callback(null, id.getSID(node));
      } else {
          callback(new Error(`Invalid key: ${key}`), null);
      }
  },
};

// Register the status service in routes
distribution.local.routes.put(distribution.local.status, 'status', (e, v) => {
  if (e) console.error(e);
  else console.log('Status service registered');
});