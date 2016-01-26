/* eslint-disable func-names */

var yeoman = require('yeoman-generator');
var objectAssign = require('object-assign');

var merge = objectAssign.bind(null, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var concat = function concat(arr1, arr2, arr3) { return [].concat(arr1, arr2, arr3); };
var prefix = function prefix(predicate) { return function (item) { return predicate + item; }; };
var getPkgName = function getPkgName(str) { return (str || '').split('/')[0]; };
var endline = function endline(str) { return str + '\n'; };
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

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('extends', { type: Array, required: false,
      desc: endline('Extends list: "yo eslint-init airbnb"'),
    });
    this.option('plugins', { type: String, required: false, alias: 'p',
      desc: endline([
        'Plugins list: "yo eslint-init --plugins require-path-exists"',
        'or "yo eslint-init -p require-path-exists"',
      ].join(' ')),
    });
  },
  writing: {
    app: function () {
      var cliConfig = {};
      var plugins = this.options.plugins || this.options.p;
      var resultConfig;

      if (this.extends) {
        cliConfig.extends = this.extends;
      }

      if (typeof plugins === 'boolean') {
        this.log('Maybe you forgot double dash: `-plugins` instead of `--plugins`');
      }
      if (plugins) {
        cliConfig.plugins = (typeof plugins === 'string') ? plugins.split(',') : plugins;
      }

      resultConfig = merge(cliConfig, this.options.config);
      this.fs.write(
        this.destinationPath('.eslintrc.json'),
        endline(stringify(truncateExtends(resultConfig)))
      );
      this.devDepsToInstall = concat(
        ['eslint'],
        (maybeStr2arr(resultConfig.extends) || []).map(getPkgName).map(prefix('eslint-config-')),
        (maybeStr2arr(resultConfig.plugins) || []).map(prefix('eslint-plugin-'))
      );
    },
  },
  install: function () {
    var skipInstall = this.options['skip-install'];
    var needInstall = !skipInstall;
    if (needInstall) {
      this.npmInstall(this.devDepsToInstall, { 'save-dev': true });
    }
  },
});
