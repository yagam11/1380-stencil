# non-distribution

This milestone aims (among others) to refresh (and confirm) everyone's
background on developing systems in the languages and libraries used in this
course.

By the end of this assignment you will be familiar with the basics of
JavaScript, shell scripting, stream processing, Docker containers, deployment
to AWS, and performance characterization—all of which will be useful for the
rest of the project.

Your task is to implement a simple search engine that crawls a set of web
pages, indexes them, and allows users to query the index. All the components
will run on a single machine.

## Getting Started

To get started with this milestone, run `npm install` inside this folder. To
execute the (initially unimplemented) crawler run `./engine.sh`. Use
`./query.js` to query the produced index. To run tests, do `npm run test`.
Initially, these will fail.

### Overview

The code inside `non-distribution` is organized as follows:

```
.
├── c            # The components of your search engine
├── d            # Data files like the index and the crawled pages
├── s            # Utility scripts for linting and submitting your solutions
├── t            # Tests for your search engine
├── README.md    # This file
├── crawl.sh     # The crawler
├── index.sh     # The indexer
├── engine.sh    # The orchestrator script that runs the crawler and the indexer
├── package.json # The npm package file that holds information like JavaScript dependencies
└── query.js     # The script you can use to query the produced global index
```

### Submitting

To submit your solution, run `./scripts/submit.sh` from the root of the stencil. This will create a
`submission.zip` file which you can upload to the autograder.


# M0: Setup & Centralized Computing

* name: `<Tianchi Huang>`

* email: `<tianchi_huang@brown.edu?>`

* cslogin: `<thuang80>`


## Summary

My implementation consists of multiple components addressing T1–T8. The most challenging aspect was merging and maintaining the correctness of the inverted index because ensuring proper handling of duplicate (URL, frequency) pairs while maintaining sorted order required careful parsing and efficient data structures.

## Correctness & Performance Characterization

To characterize correctness, we developed 8 test cases covering key aspects such as basic indexing, duplicate URL handling, sorting by frequency, query matching, merging local and global indexes, edge cases (empty inputs and special characters), scalability with large inputs, and concurrency/file handling. Performance was evaluated by measuring crawler, indexer, and query throughput, assessing efficiency across different environments (e.g., local machine vs. AWS) to ensure scalability and reliability.

*Performance*: The throughput of various subsystems is described in the `"throughput"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.


## Wild Guess

> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? Add that number to the `"dloc"` portion of package.json, and justify your answer below.

I estimate that a fully distributed, scalable version of the search engine would require around 3,000–5,000 lines of code. A distributed architecture would require worker coordination, efficient data sharding, and a scalable storage layer to handle large-scale web data efficiently. Advanced features like caching, query optimization, and distributed ranking algorithms would further contribute to the increased codebase size.