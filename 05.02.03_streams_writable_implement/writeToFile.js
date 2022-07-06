'use strict';

const ToFileStream = require('./toFileStream');
const tfs = new ToFileStream();

tfs.write({ path: "file1.txt", content: "Hello" });
tfs.write({ path: "file2.txt", content: "Node.js" });
tfs.end(() => console.log("All files created"));