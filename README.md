# generator-eslint-init

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> Yeoman generator to get eslint up and running in your project with your favorite preset (and with plugins if you want)

## Install

    npm install --global yo generator-eslint-init

## Usage

    # nope, it will do nothing, just install eslint into your project
    yo eslint-init

    # install eslint with your favorite preset
    yo eslint-init airbnb

    # another one
    yo eslint-init airbnb/legacy

    # even with plugins
    yo eslint-init airbnb --plugins react
    yo eslint-init airbnb --plugins react,require-path-exists

    # and short notation
    yo eslint-init airbnb -p react,require-path-exists

## Composability

> Composability is a way to combine smaller parts to make one large thing. Sort of [like Voltron®][voltron]  
> — [Yeoman docs](http://yeoman.io/authoring/composability.html)

Just plug in _eslint-init_ into your generator and let it setup your `.eslintrc.json` and install required `devDependencies` for you. Everybody wins.

### Install

    npm install --save generator-eslint-init

#### Compose

The whole `options.config`
will be saved into `.eslintrc.json`. Items from `extends` and `plugins` fields will be installed as `devDependencies` into your project with proper package names.

```js
this.composeWith('eslint-init', { options: {
  'skip-install': this.options['skip-install'],
  config: {
    extends: 'airbnb',
    plugins: ['require-path-exists']
  }
}}, {
  local: require.resolve('generator-eslint-init/generators/app')
});
```

[voltron]: http://25.media.tumblr.com/tumblr_m1zllfCJV21r8gq9go11_250.gif

## Improvements / Contributing

* extend existing eslint config, and do not overwrite it
* let to save in different locations: `package.json`, `.eslintrc.yml` or `.eslintrc.js`, not only in `.eslintrc.json`

Pull-requests are very welcome.

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/generator-eslint-init
[npm-image]: https://img.shields.io/npm/v/generator-eslint-init.svg?style=flat

[travis-url]: https://travis-ci.org/iamstarkov/generator-eslint-init
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-eslint-init.svg?style=flat

[depstat-url]: https://david-dm.org/iamstarkov/generator-eslint-init
[depstat-image]: https://david-dm.org/iamstarkov/generator-eslint-init.svg?style=flat
