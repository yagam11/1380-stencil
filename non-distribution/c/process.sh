#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: ./process.sh < input > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep


# Step 1: Convert input to one word per line, remove non-letter characters, make lowercase, and convert to ASCII
tr -cs '[:alpha:]' '\n' | tr '[:upper:]' '[:lower:]' | iconv -f utf8 -t ascii//TRANSLIT | 

# Step 2: Remove stopwords using the list in d/stopwords.txt
# Assuming stopwords.txt is in the same directory as this script
grep -vFx -f "$(dirname "$0")/../d/stopwords.txt"