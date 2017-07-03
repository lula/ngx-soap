const del = require('del');

del([
    'dist/libts/security/!(*.umd.js|*.esm.js|*.d.ts|**.umd.js.map|*.esm.js.map)',
    'dist/libts/!(security|*.umd.js|*.esm.js|*.d.ts|**.umd.js.map|*.esm.js.map)',
    'dist/!(libts|*.umd.js|*.esm.js|*.d.ts|**.umd.js.map|*.esm.js.map)',
]).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

