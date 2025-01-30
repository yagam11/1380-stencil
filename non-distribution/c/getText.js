#!/usr/bin/env node

/*
Extract all text from an HTML page.
Usage: ./getText.js <input > output
*/

const {convert} = require('html-to-text');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

let htmlContent = ''; // Initialize an empty string to store the HTML input

rl.on('line', (line) => {
  // 1. Read HTML input from standard input, line by line using the `readline` module.
  htmlContent += line + '\n'; // Append each line with a newline
});

// 2. after all input is received, use convert to output plain text.
rl.on('close', () => {
  const plainText = convert(htmlContent, {
    wordwrap: false, // Disable word wrapping
    preserveNewlines: false, // Do not preserve newlines from the HTML
  });

  // Output the plain text
  console.log(plainText.trim()); // Trim any leading/trailing whitespace
});


