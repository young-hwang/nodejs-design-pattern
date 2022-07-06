'use strict';

const ToFileStream = require('./toFileStream');
const tfs = new ToFileStream();

tfs.write({ path: "file1.txt", content: "Hello" });