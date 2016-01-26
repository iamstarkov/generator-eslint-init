/* eslint-disable func-names */

var yeoman = require('yeoman-generator');
var objectAssign = require('object-assign');

var merge = objectAssign.bind(null, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
var concat = function concat(arr1, arr2, arr3) { return [].concat(arr1, arr2, arr3); };
var prefixConfigs = function prefixConfigs(name) { return 'eslint-config-' + name; };
var prefixPlugins = function prefixPlugins(name) { return 'eslint-plugin-' + name; };
var endline = function endline(str) { return str + '\n'; };

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('configs', { type: Array, required: false,
      desc: endline('Configs list: "yo eslint-init airbnb"'),
    });
    this.argument('plugins', { type: Array, required: false,
      desc: endline('Plugins list: "yo eslint-init -p require-path-exists"'),
    });
  },
  writing: {
    app: function() {
      var config = this.options.config;
      var configs = this.configs || config.configs || [];
      var plugins = this.plugins || config.plugins || [];
      this.devDepsToInstall = concat(
        ['eslint'],
        configs.map(prefixConfigs),
        plugins.map(prefixPlugins)
      );
      this.fs.write(
        this.destinationPath('.eslintrc.json'),
        endline(stringify({
          extends: (configs.length === 1) ? configs[0] : configs,
          plugins: plugins,
        }))
      );
    },
  },
  conflicts: function conflicts() {
    // it’s not "install" because generated project can use "prepublish" script
    // and then babel should already exists in the generated project
    var skipInstall = this.options['skip-install'];
    var needInstall = !skipInstall;
    if (needInstall) {
      this.npmInstall(this.devDepsToInstall, { 'save-dev': true });
    }
  },
});
