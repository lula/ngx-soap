const fs = require('fs');
let resizable = fs.readFileSync('package.json').toString();
fs.writeFileSync('dist/package.json', resizable);

let readme = fs.readFileSync("README.md").toString();
fs.writeFileSync('dist/README.md', readme);