import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/index.ts',
  dest: 'dist/ngxsoap.umd.js',
  sourceMap: true,
  format: 'umd',
  moduleName: 'ngxsoap',
  plugins: [
    typescript({
      typescript:require('typescript')
    }),
    resolve({
      module: true,
      main: 'index.js'
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'src/libts/client': ['Client']
      }
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