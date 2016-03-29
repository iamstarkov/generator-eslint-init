/* eslint-disable func-names, vars-on-top, no-extra-bind */
'use strict';

var yeoman = require('yeoman-generator');
var R = require('ramda');
var depsObject = require('deps-object');
var sortedObject = require('sorted-object');
var splitKeywords = require('split-keywords');

var stringify = require('./json-fp').stringify;
var parse = require('./json-fp').parse;
var getPkgName = function getPkgName(str) { return (str || '').split('/')[0]; };

var truncateExtends = function truncateExtends(input) {
  var obj = input;
  if (obj.extends && obj.extends.length === 1) {
    obj.extends = obj.extends[0];
  }
  return obj;
};
var maybeStr2arr = function maybeStr2arr(input) {
  if (typeof input === 'boolean') {
    return undefined;
  }
  return (typeof input === 'string') ? [input] : input;
};

// concatAll :: [Array] -> Array
var concatAll = R.reduce(R.concat, []);

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('extends', { type: Array, required: false,
      desc: 'Extends list: "yo eslint-init airbnb"'
    });
    this.option('plugins', { type: String, required: false, alias: 'p',
      desc: 'Plugins list: "yo eslint-init -p require-path-exists"'
    });

    // helpers
    this.saveDepsToPkg = function (deps) {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var currentDeps = pkg.devDependencies || {};
      var mergedDeps = R.merge(currentDeps, deps);
      var sortedDeps = sortedObject(mergedDeps);
      pkg.devDependencies = sortedDeps;
      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    };
  },
  writing: function () {
    var cli = {};

    if (this.extends) {
      cli.extends = this.extends;
    }

    var plugins = this.options.plugins;
    if (typeof plugins === 'boolean') {
      this.log('Maybe you forgot double dash: `-plugins` instead of `--plugins`');
    }
    if (plugins) {
      cli.plugins = (typeof plugins === 'string') ? splitKeywords(plugins) : plugins;
    }

    var existing = this.fs.exists(this.destinationPath('.eslintrc.json'))
          ? parse(this.fs.read(this.destinationPath('.eslintrc.json')))
          : {};

    var options = this.options.config || {};
    var result = R.mergeAll([existing, cli, options]);
    this.fs.write(
      this.destinationPath('.eslintrc.json'),
      (stringify(truncateExtends(result)) + '\n')
    );

    var deps = concatAll([
      ['eslint@^2.4.0'],
      (maybeStr2arr(result.extends) || []).map(getPkgName).map(R.concat('eslint-config-')),
      (maybeStr2arr(result.plugins) || []).map(R.concat('eslint-plugin-'))
    ]);
    return depsObject(deps)
      .then(function (devDeps) {
        this.saveDepsToPkg(devDeps);
      }.bind(this))
      .catch(function (reason) {
        throw reason;
      }.bind(this));
  },
  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  }
});
