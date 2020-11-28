// function(exports, module, requirem __filename, __dirname){

const {log} = console;

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const srcPath = "./src/js/sails.io.js";
// const srcPath = "./src/js/test-js.js";

const reader = readline.createInterface({
  input: fs.createReadStream(srcPath),
  // output: process.stdout,
  console: false
});

const dist = fs.createWriteStream("./dist/js/sails.io.min.js", {
  flags: "w+"
});

let multiline_comments = [];
reader.on("line", (line) => {

  // Match a single line line
  if (/\/\/.*/.test(line)) {
    line = line.replace(/\/\/.*/, "");
  }

  // /\/\*[^]*?\*\//g
  //     (/\*[^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*

  // Match multiline comments within a single line
  if (/\/\*([\s\S]*)\*\//g.test(line)) {
    line = line.replace(/\/\*([\s\S]*)\*\//g, "");
  }

  // Match the start of a multiline comment
  if (/\/\*([\s\S]*)/.test(line)) {
    multiline_comments.push(line);
  }

  // Activate collect action if all is well
  if (multiline_comments.length == 0) {
    if (line.trim()) {
      dist.write(`${line}
`);
      log(line);
    }
  }

  // Match the end of a multiline comment
  if (multiline_comments.length > 0 && /([\s\S]*)\*\//g.test(line)) {
    multiline_comments.push(line);
    multiline_comments = [];
  }

});

/*

dist.write(`${line}`);
  log(line);
 */

// return module.exports
// }