import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'dist/src/index.js',
  dest: 'dist/bundles/ngx-soap.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'ngx-soap',
  plugins: [
    resolve({
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    uglify()
  ],
  external: [
    '@angular/core', 
    '@angular/http',
    'rxjs/Subject', 
    'rxjs/Observable',
    'rxjs/observable/merge',
    'rxjs/operator/share',
    'rxjs/add/operator/map',
    'lodash',
    'sax',
    'crypto',
    'uuid'
  ]
  // ,
  // globals: {
  //   '@angular/core': 'ng.core',
  //   '@angular/http': 'ng.http',
  //   'rxjs/Observable': 'Rx',
  //   'rxjs/Subject': 'Rx',
  //   'rxjs/observable/merge': 'Rx.Observable',
  //   'rxjs/observable/share': 'Rx.Observable',
  //   'rxjs/add/operator/map': 'Rx.Observable'
  // }
}