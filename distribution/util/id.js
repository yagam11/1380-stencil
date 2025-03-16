/** @typedef {import("../types.js").Node} Node */

const assert = require('assert');
const crypto = require('crypto');

// The ID is the SHA256 hash of the JSON representation of the object
/** @typedef {!string} ID */

/**
 * @param {any} obj
 * @return {ID}
 */
function getID(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

/**
 * The NID is the SHA256 hash of the JSON representation of the node
 * @param {Node} node
 * @return {ID}
 */
function getNID(node) {
  node = {ip: node.ip, port: node.port};
  return getID(node);
}

/**
 * The SID is the first 5 characters of the NID
 * @param {Node} node
 * @return {ID}
 */
function getSID(node) {
  return getNID(node).substring(0, 5);
}


function getMID(message) {
  const msg = {};
  msg.date = new Date().getTime();
  msg.mss = message;
  return getID(msg);
}

function idToNum(id) {
  const n = parseInt(id, 16);
  assert(!isNaN(n), 'idToNum: id is not in KID form!');
  return n;
}

function naiveHash(kid, nids) {
  nids.sort();
  return nids[idToNum(kid) % nids.length];
}

function consistentHash(kid, nids) {
  const hashToNum = (value) => 
    parseInt(crypto.createHash('sha256').update(value).digest('hex').slice(0, 8), 16);
  const hashRing = nids.map(nid => ({ id: nid, hash: hashToNum(nid) }));
  const kidHash = hashToNum(kid);
  hashRing.push({ id: kid, hash: kidHash });
  hashRing.sort((b, a) => a.hash - b.hash);
  const kidIndex = hashRing.findIndex(item => item.id === kid);
  const nextIndex = (kidIndex + 1) % hashRing.length;
  return hashRing[nextIndex].id;

}


function rendezvousHash(kid, nids) {
  // Convert a hashed value to a numerical representation
  const hashToNum = (value) => 
    parseInt(crypto.createHash('sha256').update(value).digest('hex').slice(0, 8), 16);

  // Compute hash scores for each node by concatenating kid + nid
  let maxHash = -1;
  let selectedNid = null;

  for (const nid of nids) {
      const combinedHash = hashToNum(kid + nid); // Hash kid + nid
      if (combinedHash > maxHash) {
          maxHash = combinedHash;
          selectedNid = nid;
      }
  }

  return selectedNid;
}

module.exports = {
  getID,
  getNID,
  getSID,
  getMID,
  naiveHash,
  consistentHash,
  rendezvousHash,
};
