# generator-eslint-init

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> Yeoman generator to get eslint up and running in your project with your favorite preset

## Install

    npm install --global yo generator-eslint-init

## Usage

    # nope, it will do nothing, just install eslint into your project
    yo eslint-init

    # install eslint with your favorite preset
    yo eslint-init airbnb

    # or with old one
    yo eslint-init airbnb/legacy

    # or even with plugins
    yo eslint-init airbnb -p require-path-exists
    yo eslint-init airbnb --plugins require-path-exists

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/generator-eslint-init
[npm-image]: https://img.shields.io/npm/v/generator-eslint-init.svg?style=flat

[travis-url]: https://travis-ci.org/iamstarkov/generator-eslint-init
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-eslint-init.svg?style=flat

[depstat-url]: https://david-dm.org/iamstarkov/generator-eslint-init
[depstat-image]: https://david-dm.org/iamstarkov/generator-eslint-init.svg?style=flat
