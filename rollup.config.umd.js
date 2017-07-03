import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/index.ts',
  dest: 'dist/ngx-soap.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'ngx-soap',
  plugins: [
    typescript({
      typescript:require('typescript')
    }),
    resolve({
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
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
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/observable/merge': 'Rx.Observable',
    'rxjs/observable/share': 'Rx.Observable',
    'rxjs/add/operator/map': 'Rx.Observable'
  }
}