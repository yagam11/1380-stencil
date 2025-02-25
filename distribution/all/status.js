const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    get: (configuration, callback) => {
      const message = [configuration];
      const remote = {
        service: 'status',
        method: 'get',
      };
      global.distribution[context.gid].comm.send(message, remote, (e, v) => {
        switch (configuration) {
          case 'heapTotal':
            const accumulatedValue = Object.values(v).reduce((acc, val) => {
              return acc + val;
            }, 0);
            callback(e, accumulatedValue);
            break;
          case 'nid':
            const keyList = Object.values(v).reduce((acc, val) => {
              return acc.concat(val);
            }, []);
            callback(e, keyList);
            break;
          default:
            callback(e, v);
            break;
        }
      });
    },
  
    spawn: (configuration, callback) => {
      callback = callback || function() {};
      global.distribution.local.status.spawn(configuration, (e, v) => {
        if (e) {
          callback(e);
        } else {
          global.distribution.local.groups.add(context.gid, configuration, () => {
            callback(null, v);
          });
        }
        global.distribution[context.gid].comm.send([context.gid, configuration],
          { service: 'groups', method: 'add' },
          () => {}
        );
      });
    },
    
    // spawn: (configuration, callback) => {
    //   global.distribution[context.gid].comm.send([configuration], { service: "status", method: "status", gid: context.gid }, (e, v) => {
    //     callback(e, v);
    //   });
    // },

    stop: (callback) => {
      global.distribution[context.gid].comm.send([], { service: "status", method: "stop", gid: context.gid }, (e, v) => {
        callback(e, v);
      });
    },
  };
};

// module.exports = status;
module.exports = require('@brown-ds/distribution/distribution/all/status');