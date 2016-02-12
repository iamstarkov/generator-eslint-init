/* eslint-disable func-names,vars-on-top */
'use strict';

var yeoman = require('yeoman-generator');
var R = require('ramda');
var Promise = require('pinkie-promise');
var latest = require('latest-version');
var sortedObject = require('sorted-object');

var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
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

// splitAndTrimEach :: String -> [String]
var splitAndTrimEach = R.pipe(R.split(','), R.map(R.trim));

// concatAll :: [Array] -> Array
var concatAll = R.reduce(R.concat, []);

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('extends', { type: Array, required: false,
      desc: 'Extends list: "yo eslint-init airbnb"',
    });
    this.option('plugins', { type: String, required: false, alias: 'p',
      desc: 'Plugins list: "yo eslint-init -p require-path-exists"',
    });
  },
  writing: {
    app: function () {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var done = this.async();

      var cli = {};

      if (this.extends) {
        cli.extends = this.extends;
      }

      var plugins = this.options.plugins;
      if (typeof plugins === 'boolean') {
        this.log('Maybe you forgot double dash: `-plugins` instead of `--plugins`');
      }
      if (plugins) {
        cli.plugins = (typeof plugins === 'string') ? splitAndTrimEach(plugins) : plugins;
      }

      var existing = this.fs.exists(this.destinationPath('.eslintrc.json'))
            ? parse(this.fs.read(this.destinationPath('.eslintrc.json')))
            : {};

      var options = this.options.config || {};
      var result = R.mergeAll([existing, cli, options]);
      var deps = concatAll([
        ['eslint'],
        (maybeStr2arr(result.extends) || []).map(getPkgName).map(R.concat('eslint-config-')),
        (maybeStr2arr(result.plugins) || []).map(R.concat('eslint-plugin-')),
      ]);
      Promise.all(deps.map(latest))
        .then(function (versions) {
          this.fs.write(
            this.destinationPath('.eslintrc.json'),
            (stringify(truncateExtends(result)) + '\n')
          );
          var devDeps = R.zipObj(deps, versions.map(R.concat('^')));
          pkg.devDependencies = sortedObject(R.merge((pkg.devDependencies || {}), devDeps));
          this.fs.writeJSON(this.destinationPath('package.json'), pkg);
          done();
        }.bind(this))
        .catch(function () {
          this.log('Warning: one of [' + deps.join(', ') + '] dont exist');
          done();
        }.bind(this));
    },
  },
  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  },
});
