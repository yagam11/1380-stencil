#!/usr/bin/env node

/*
Merge the current inverted index (assuming the right structure) with the global index file
Usage: cat input | ./merge.js global-index > output

The inverted indices have the different structures!

Each line of a local index is formatted as:
  - `<word/ngram> | <frequency> | <url>`

Each line of a global index is be formatted as:
  - `<word/ngram> | <url_1> <frequency_1> <url_2> <frequency_2> ... <url_n> <frequency_n>`
  - Where pairs of `url` and `frequency` are in descending order of frequency
  - Everything after `|` is space-separated

-------------------------------------------------------------------------------------
Example:

local index:
  word1 word2 | 8 | url1
  word3 | 1 | url9
EXISTING global index:
  word1 word2 | url4 2
  word3 | url3 2

merge into the NEW global index:
  word1 word2 | url1 8 url4 2
  word3 | url3 2 url9 1

Remember to error gracefully, particularly when reading the global index file.
*/

const fs = require('fs');
const readline = require('readline');

// Compare function for sorting by frequency in descending order
const compare = (a, b) => b.freq - a.freq;

// Read the local index from stdin
const rl = readline.createInterface({
  input: process.stdin,
});

let localIndex = ''; // Store the local index data

rl.on('line', (line) => {
  localIndex += line + '\n'; // Append each line to the local index
});

rl.on('close', () => {
  // Read the global index file from the command-line argument
  const globalIndexFile = process.argv[2];
  if (!globalIndexFile) {
    console.error('Error: Global index file not provided.');
    process.exit(1);
  }

  fs.readFile(globalIndexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading global index file:', err);
      process.exit(1);
    }

    printMerged(localIndex, data);
  });
});

const printMerged = (localIndex, globalIndex) => {
  const local = {}; // Store local index data
  const global = {}; // Store global index data

  // Parse the local index
  localIndex.trim().split('\n').forEach((line) => {
    const [term, freq, url] = line.split(' | ');
    if (term && freq && url) {
      if (!local[term]) {
        local[term] = {};
      }
      // Overwrite the URL entry instead of appending
      local[term][url] = parseInt(freq, 10);
    }
  });

  // Convert local index to the expected list format
  Object.keys(local).forEach((term) => {
    local[term] = Object.entries(local[term]).map(([url, freq]) => ({url, freq}));
  });

  // Parse the global index
  globalIndex.trim().split('\n').forEach((line) => {
    const [term, ...rest] = line.split(' | ');
    if (term && rest.length > 0) {
      const urlFreqPairs = rest[0].split(' ');
      global[term] = [];
      for (let i = 0; i < urlFreqPairs.length; i += 2) {
        if (urlFreqPairs[i] && urlFreqPairs[i + 1]) {
          global[term].push({url: urlFreqPairs[i], freq: parseInt(urlFreqPairs[i + 1], 10)});
        }
      }
    }
  });

  // Merge local index into global index
  for (const term in local) {
    if (global[term]) {
      // Convert global index to a dictionary to avoid duplicate URLs
      const globalDict = {};
      global[term].forEach(({url, freq}) => {
        globalDict[url] = freq;
      });

      // Merge with the local index (overwriting if needed)
      local[term].forEach(({url, freq}) => {
        globalDict[url] = freq; // Overwrite
      });

      // Convert back to sorted array
      global[term] = Object.entries(globalDict).map(([url, freq]) => ({url, freq}));
      global[term].sort(compare);
    } else {
      global[term] = local[term]; // Add new term to global
    }
  }

  // Print the merged global index
  for (const term in global) {
    const urlFreqPairs = global[term].map(({url, freq}) => `${url} ${freq}`).join(' ');
    console.log(`${term} | ${urlFreqPairs}`);
  }
};
