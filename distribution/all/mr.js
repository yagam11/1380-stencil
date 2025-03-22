/** @typedef {import("../types").Callback} Callback */
const groups = require("../local/groups");
const id = require("../util/id");
const distribution = global.distribution;
const localRoutes = require("../local/routes");
const remoteRoutes = require("../all/routes");

// Map service to be registered on each node
const mapService = {
  map: (msg, cb) => {
    const mapFunc = eval('(' + msg.mapFunc + ')');
    distribution[msg.gid].store.get(msg.key, (err, value) => {
      if (err) return cb(err);
      // Apply the map function to the value
      const result = mapFunc(msg.key, value);
      cb(null, { result });
    });
  }
};

function mr(config) {
  const context = {
    gid: config.gid || 'all',
  };
  
  function exec(configuration, cb) {
    const { map, reduce, keys } = configuration;
    console.log(`[MapReduce] GID: ${context.gid}, Keys:`, keys);

    const nodeInfo = global.nodeConfig || { ip: 'unknown', port: 'unknown' };
    console.log(`[MapReduce Orchestrator] Running on ${nodeInfo.ip}:${nodeInfo.port}`);

    const kvPairs = [];
    const shuffleDict = {};
    let completed = 0;

    groups.get(context.gid, (err, group) => {
      if (err) return cb(err);

      const nids = Object.keys(group);
      const distributedRoutes = remoteRoutes({ gid: context.gid });

      // Register map service remotely on all nodes in the group
      Object.values(group).forEach((node) => {
        distributedRoutes.put(mapService, 'mr-map', (err) => {
          console.log(`[MR] Registered 'mr-map' on node ${id.getSID(node)}`);
        });
      });

      keys.forEach((key) => {
        const kid = id.getID(key);
        const responsibleNid = id.naiveHash(kid, nids);
        const responsibleNode = group[responsibleNid];

        const message = {
          gid: context.gid,
          key,
          mapFunc: map.toString(),
        };

        const remote = {
          node: responsibleNode,
          service: 'mr-map',
          method: 'map',
        };

        distribution.local.comm.send([message], remote, (err, res) => {
          if (err) {
            console.error(`[MR] Failed to send map for key "${key}":`, err);
          } else {
            console.log(`[MR] Map result for "${key}":`, res);
            for (const obj of res.result) {
              const [k, v] = Object.entries(obj)[0];
              if (!shuffleDict[k]) shuffleDict[k] = [];
              shuffleDict[k].push(v);
            }
          }

          completed++;
          if (completed === keys.length) {
            console.log(`[MR] All maps complete. Proceeding to reduce.`);
            const result = [];
            for (const [key, values] of Object.entries(shuffleDict)) {
              const reduced = reduce(key, values);
              result.push(reduced);
            }
            console.log(`[MR] Final Reduce Output:`, result);
            cb(null, result);
          }
        });
      });
    });
  }

  return { exec };
};

module.exports = mr;
