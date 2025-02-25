const comm = require("./comm");

/** @typedef {import("../types").Callback} Callback */

function routes(config) {
  const context = {};
  context.gid = config.gid || "all";
  const groupComm = comm({ gid: context.gid });

  return {
    put: (service, name, callback = () => {}) => {
      const remote = { service: "routes", method: "put" };
      groupComm.send([service, name], remote, callback);
    },

    rem: (name, callback = () => {}) => {
      const remote = { service: "routes", method: "rem" };
      groupComm.send([name], remote, callback);
    },
  };
}

module.exports = routes;
