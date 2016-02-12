/* eslint-env mocha */
/* eslint-disable func-names, no-extra-bind */
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };

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
      assert.fileContent('.eslintrc.json', '{}');
      done();
    });
  });

  describe('cli', function () {
    describe('extends', function () {
      it('uses one extends from arguments', function (done) {
        var input = { extends: 'airbnb' };
        generator().withArguments(['airbnb']).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify(input));
          done();
        });
      });
      it('uses several extends array from arguments', function (done) {
        var input = { extends: ['airbnb', 'hexo'] };
        generator().withArguments(['airbnb', 'hexo']).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify(input));
          done();
        });
      });
    });

    describe('plugins', function () {
      it('uses plugins string with one item from options', function (done) {
        generator().withOptions({ plugins: 'react' }).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify({ plugins: ['react'] }));
          done();
        });
      });

      it('uses plugins string from options', function (done) {
        generator().withOptions({ plugins: 'react,fand' }).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify({ plugins: ['react', 'fand'] }));
          done();
        });
      });

      it('uses plugins array with one item from options', function (done) {
        var input = { plugins: ['react'] };
        generator().withOptions(input).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify(input));
          done();
        });
      });

      it('uses plugins array from options', function (done) {
        var input = { plugins: ['react', 'fand'] };
        generator().withOptions(input).on('end', function () {
          assert.fileContent('.eslintrc.json', stringify(input));
          done();
        });
      });
    });
  });

  describe('compose', function () {
    it('uses config option', function (done) {
      var input = { key: 'val' };
      generator().withOptions({ config: input }).on('end', function () {
        assert.fileContent('.eslintrc.json', stringify(input));
        done();
      });
    });

    it('uses config.extends string option', function (done) {
      var input = { extends: 'airbnb' };
      generator().withOptions({ config: input }).on('end', function () {
        assert.fileContent('.eslintrc.json', stringify(input));
        done();
      });
    });

    it('uses config.extends array option', function (done) {
      var input = { extends: ['airbnb', 'hexo'] };
      generator().withOptions({ config: input }).on('end', function () {
        assert.fileContent('.eslintrc.json', stringify(input));
        done();
      });
    });

    it('uses config.plugins array option', function (done) {
      var input = { plugins: ['react', 'fand'] };
      generator().withOptions({ config: input }).on('end', function () {
        assert.fileContent('.eslintrc.json', stringify(input));
        done();
      });
    });
  });

  it('install extends and plugins with proper prefixes', function (done) {
    var input = {
      extends: 'airbnb/legacy',
      plugins: ['require-path-exists'],
    };
    generator()
      .withOptions({ config: input })
      .on('end', function () {
        assert.fileContent('.eslintrc.json', stringify(input));
        assert.file('package.json');
        assert.fileContent('package.json', /eslint/);
        assert.fileContent('package.json', /babel-eslint/);
        assert.fileContent('package.json', /eslint-config-airbnb":/);
        assert.fileContent('package.json', /eslint-plugin-require-path-exists/);
        done();
      });
  });
});
