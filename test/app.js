/* eslint-disable func-names */
/* eslint-env mocha */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };

var generator = function() {
  return helpers.run(path.join(__dirname, '../generators/app'));
};

describe('generator-eslint-init:app', function () {
  it('creates files', function(done) {
    generator().on('end', function() {
      assert.file('.eslintrc.json');
      done();
    });
  });

  it('creates empty files with zero input', function(done) {
    generator().on('end', function() {
      assert.fileContent('.eslintrc.json', '{}');
      done();
    });
  });

  describe('cli', function() {
    describe('extends', function() {
      it('uses one extends from arguments', function(done) {
        generator().withArguments(['airbnb']).on('end', function() {
          assert.fileContent('.eslintrc.json', /"extends": "airbnb"/);
          done();
        });
      });
      it('uses several extends array from arguments', function(done) {
        generator().withArguments(['airbnb', 'meow']).on('end', function() {
          assert.fileContent('.eslintrc.json', /"extends":[\n"airbnb", "meow"\n]/);
          done();
        });
      });
    });

    describe('plugins', function() {
      it('uses plugins string with one item from options', function(done) {
        generator().withOptions({ plugins: 'purr'}).on('end', function() {
          assert.fileContent('.eslintrc.json', /"plugins":[\n"purr" \n]/);
          done();
        });
      });

      it('uses plugins string from options', function(done) {
        generator().withOptions({ plugins: 'purr,scratch'}).on('end', function() {
          assert.fileContent('.eslintrc.json', /"plugins":[\n"purr", "scratch"\n]/);
          done();
        });
      });

      it('uses plugins array with one item from options', function(done) {
        generator().withOptions({ plugins: ['purr']}).on('end', function() {
          assert.fileContent('.eslintrc.json', /"plugins":[\n"purr" \n]/);
          done();
        });
      });

      it('uses plugins array from options', function(done) {
        generator().withOptions({ plugins: ['purr', 'scratch']}).on('end', function() {
          assert.fileContent('.eslintrc.json', /"plugins":[\n"purr", "scratch"\n]/);
          done();
        });
      });
    });
  });

  describe('compose', function() {
    it('uses config option', function(done) {
      generator().withOptions({ config: { key: 'val' }}).on('end', function() {
        assert.fileContent('.eslintrc.json', /"key": "val"/);
        done();
      });
    });

    it('uses config.extends string option', function(done) {
      generator().withOptions({ config: { extends: 'meow' }}).on('end', function() {
        assert.fileContent('.eslintrc.json', /"extends": "meow"/);
        done();
      });
    });

    it('uses config.extends array option', function(done) {
      generator().withOptions({ config: { extends: ['meow', 'purr'] }}).on('end', function() {
        assert.fileContent('.eslintrc.json', /"extends":[\n"meow", "purr"\n]/);
        done();
      });
    });

    it('uses config.plugins array option', function(done) {
      generator().withOptions({ config: { plugins: ['meow', 'purr'] }}).on('end', function() {
        assert.fileContent('.eslintrc.json', /"plugins":[\n"meow", "purr"\n]/);
        done();
      });
    });
  });

  it('install extends and plugins with proper prefixes', function(done) {
    var pkg = {
      name: 'name',
      description: 'desc',
      repository: 'iamstarkov/generator-eslint-init',
      license: 'MIT',
    };
    generator()
      .withOptions({ skipInstall: false })
      .withOptions({ config: {
        extends: 'airbnb/legacy',
        plugins: ['require-path-exists']
      }})
      .on('ready', function(gen) {
        gen.fs.write(gen.destinationPath('package.json'), stringify(pkg));
      }.bind(this))
      .on('end', function() {
        assert.fileContent('.eslintrc.json', /"extends": "airbnb\/legacy"/);
        assert.file('package.json');
        assert.fileContent('package.json', /eslint/);
        assert.fileContent('package.json', /eslint-config-airbnb":/);
        assert.fileContent('package.json', /eslint-plugin-require-path-exists/);
        done();
      });
  });
});
