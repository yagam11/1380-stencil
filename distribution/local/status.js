// const id = require('../util/id');

// const status = {};

// global.moreStatus = {
//   sid: id.getSID(global.nodeConfig), // Use id.getSID directly
//   nid: id.getNID(global.nodeConfig), // Use id.getNID directly
//   counts: 0,
// };

// status.get = function(configuration, callback = () => {}) {
//   callback = callback || function() { };
//   const statusValues = {
//     // static properties
//     nid: () => global.moreStatus.nid,
//     sid: () => global.moreStatus.sid,
//     ip: () => global.nodeConfig.ip,
//     port: () => global.nodeConfig.port,

//     // dynamic properties
//     counts: () => global.moreStatus.counts,
//     heapTotal: () => process.memoryUsage().heapTotal,
//     heapUsed: () => process.memoryUsage().heapUsed,
//   };

//   if (statusValues.hasOwnProperty(configuration)) {
//     try {
//       const value = typeof statusValues[configuration] === 'function'
//         ? statusValues[configuration]()
//         : statusValues[configuration];
//       callback(null, value);
//       return value; 
//     } catch (e) {
//       callback(e);
//     }
//   } else {
//     callback(new Error(`Invalid configuration: ${configuration}`));
//   }
// };

// status.spawn = require('@brown-ds/distribution/distribution/local/status').spawn; 
// status.stop = require('@brown-ds/distribution/distribution/local/status').stop; 
// module.exports = status;
module.exports = require('@brown-ds/distribution/distribution/local/status');
