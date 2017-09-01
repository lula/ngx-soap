const del = require('del');

del([
    'dist/node_modules'
    // 'dist/src/libts/security/!(*.umd.js|*.esm.js|*.d.ts|*.js|**.umd.js.map|*.esm.js.map|*.metadata.json|*.ngsummary.json)',
    // 'dist/src/libts/!(security|*.umd.js|*.esm.js|*.d.ts|*.js|**.umd.js.map|*.esm.js.map|*.metadata.json|*.ngsummary.json)',
    // 'dist/src/!(libts|*.umd.js|*.esm.js|*.d.ts|*.js|**.umd.js.map|*.esm.js.map|*.metadata.json|*.ngsummary.json)',
]).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

