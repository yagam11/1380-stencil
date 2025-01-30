#!/usr/bin/env node

/*
Extract all URLs from a web page.
Usage: ./getURLs.js <base_url>
*/

const readline = require('readline');
const {JSDOM} = require('jsdom');
const {URL} = require('url');

// 1. Read the base URL from the command-line argument using `process.argv`.
let baseURL = process.argv[2]; // Get the base URL from the command line

if (baseURL.endsWith('index.html')) {
  baseURL = baseURL.slice(0, baseURL.length - 'index.html'.length);
} else {
  baseURL += '/';
}
let htmlContent = ''; // Store the entire HTML input

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on('line', (line) => {
  // 2. Read HTML input from standard input (stdin) line by line using the `readline` module.
  htmlContent += line + '\n';
});

rl.on('close', () => {
  // 3. Parse HTML using jsdom
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // 4. Find all URLs:
  //  - select all anchor (`<a>`) elements) with an `href` attribute using `querySelectorAll`.
  //  - extract the value of the `href` attribute for each anchor element.
  const links = document.querySelectorAll('a[href]');
  const urls = new Set(); // Use a Set to avoid duplicate URLs
  links.forEach((anchor) => {
    const href = anchor.getAttribute('href');

    // Convert relative URLs to absolute URLs
    try {
      const absoluteURL = new URL(href, baseURL).href;
      urls.add(absoluteURL); // Add the absolute URL to the Set
    } catch (error) {
      // Ignore invalid URLs
    }
  });

  // 5. Print each absolute URL to the console, one per line.
  urls.forEach((url) => {
    console.log(url);
  });
});


