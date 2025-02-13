const id = require('../util/id');
const log = require('../util/log');

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  ip: global.nodeConfig.ip,
  port: global.nodeConfig.port,
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() { };

  // Supported keys for status retrieval
  const statusInfo = {
    nid: global.moreStatus.nid,
    sid: global.moreStatus.sid,
    ip: global.moreStatus.ip,
    port: global.moreStatus.port,
    counts: global.moreStatus.counts,
    heapTotal: process.memoryUsage().heapTotal,
    heapUsed: process.memoryUsage().heapUsed,
  };

  // If the requested key exists, return its value
  if (statusInfo.hasOwnProperty(configuration)) {
    callback(null, statusInfo[configuration]);
  } else {
    callback(new Error(`Invalid status key: ${configuration}`), null);
  }
};


status.spawn = function(configuration, callback) {
};

status.stop = function(callback) {
};

module.exports = status;
