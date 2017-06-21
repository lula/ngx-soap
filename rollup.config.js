// import includepaths from 'rollup-plugin-includepaths';
// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/ngxsoap.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.ngxsoap',
  plugins: [
    // resolve({
    //   jsnext: true,
    //   main: true
    // }),
    // commonjs({
    //   include: 'node_modules/soap-lib/**',
    //   namedExports: {
    //     'node_modules/soap-lib/soap.js': [ 'soap' ]
    //   }      
    // })
    // includepaths({
    //   paths: ['./lib'],
    //   extensions: ['.js']
    // })
  ],
  external: [
    '@angular/core', 
    '@angular/http',
    'rxjs/Subject', 
    'rxjs/Observable',
    'rxjs/observable/merge',
    'rxjs/operator/share',
    'rxjs/add/operator/map'
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/observable/merge': 'Rx.Observable',
    'rxjs/observable/share': 'Rx.Observable',
    'rxjs/add/operator/map': 'Rx.Observable',
  }
}