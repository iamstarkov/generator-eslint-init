/* eslint-env mocha */
/* eslint-disable func-names, no-extra-bind */
'use strict';

var path = require('path');
var R = require('ramda');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var depsObject = require('deps-object');
var stringify = require('./generators/app/json-fp').stringify;

var generator = function () {
  return helpers.run(path.join(__dirname, './generators/app'));
};

describe('generator-eslint-init:app', function () {
  it('creates files', function (done) {
    generator().on('end', function () {
      assert.file('.eslintrc.json');
      done();
    });
  });

  it('creates empty files with zero input', function (done) {
    generator().on('end', function () {
      assert.jsonFileContent('.eslintrc.json', {});
      done();
    });
  });

  describe('cli', function () {
    describe('extends', function () {
      it('uses one extends from arguments', function (done) {
        var input = { extends: 'airbnb' };
        generator().withArguments(['airbnb']).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', input);
          done();
        });
      });
      it('uses several extends array from arguments', function (done) {
        var input = { extends: ['airbnb', 'hexo'] };
        generator().withArguments(['airbnb', 'hexo']).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', input);
          done();
        });
      });
    });

    describe('plugins', function () {
      it('uses plugins string with one item from options', function (done) {
        generator().withOptions({ plugins: 'react' }).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', { plugins: ['react'] });
          done();
        });
      });

      it('uses plugins string from options', function (done) {
        generator().withOptions({ plugins: 'react,fand' }).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', { plugins: ['react', 'fand'] });
          done();
        });
      });

      it('uses plugins array with one item from options', function (done) {
        var input = { plugins: ['react'] };
        generator().withOptions(input).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', input);
          done();
        });
      });

      it('uses plugins array from options', function (done) {
        var input = { plugins: ['react', 'fand'] };
        generator().withOptions(input).on('end', function () {
          assert.jsonFileContent('.eslintrc.json', input);
          done();
        });
      });
    });
  });

  describe('compose', function () {
    it('uses config option', function (done) {
      var input = { key: 'val' };
      generator().withOptions({ config: input }).on('end', function () {
        assert.jsonFileContent('.eslintrc.json', input);
        done();
      });
    });

    it('uses config.extends string option', function (done) {
      var input = { extends: 'airbnb' };
      generator().withOptions({ config: input }).on('end', function () {
        assert.jsonFileContent('.eslintrc.json', input);
        done();
      });
    });

    it('uses config.extends array option', function (done) {
      var input = { extends: ['airbnb', 'hexo'] };
      generator().withOptions({ config: input }).on('end', function () {
        assert.jsonFileContent('.eslintrc.json', input);
        done();
      });
    });

    it('uses config.plugins array option', function (done) {
      var input = { plugins: ['react', 'fand'] };
      generator().withOptions({ config: input }).on('end', function () {
        assert.jsonFileContent('.eslintrc.json', input);
        done();
      });
    });
  });

  it('install extends and plugins with proper prefixes', function (done) {
    var deps = [
      'eslint@^2.4.0',
      'eslint-config-airbnb', 'eslint-plugin-require-path-exists'
    ];
    var input = {
      extends: 'airbnb/legacy',
      plugins: ['require-path-exists']
    };
    depsObject(deps).then(function (devDependencies) {
      generator()
        .withOptions({ config: input })
        .on('end', function () {
          assert.jsonFileContent('.eslintrc.json', input);
          assert.jsonFileContent('package.json', {
            devDependencies: devDependencies
          });
          done();
        });
    });
  });

  it('extends and doesnt overwrite existing .eslintrc.json', function (done) {
    var deps = [
      'eslint@^2.4.0',
      'eslint-config-airbnb', 'eslint-plugin-require-path-exists'
    ];
    var input = {
      extends: 'airbnb/legacy',
      plugins: ['require-path-exists']
    };
    var existing = { key: 'val' };
    depsObject(deps).then(function (devDependencies) {
      generator()
        .withOptions({ config: input })
        .on('ready', function (gen) {
          gen.fs.write(gen.destinationPath('.eslintrc.json'), stringify(existing));
        }.bind(this))
        .on('end', function () {
          assert.jsonFileContent('.eslintrc.json', R.merge(existing, input));
          assert.jsonFileContent('package.json', {
            devDependencies: devDependencies
          });
          done();
        });
    });
  });
});
