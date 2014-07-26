# grunt-angular-md5-map v0.2.0

> Generate an AngularJS provider to automatically append the MD5 hash of a file as a query at the end, ie. 'myfile.js?md5_hash_will_go_here'.


## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-angular-md5-map --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-md5-map');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*


### Usage Examples

```js
angularMd5Map: {
  generateTranslationsMd5Json: {
  	options: {
  		removedBaseDir: 'static/i18n',
  		moduleName: 'translationsMd5Module',
  		moduleVariableName: 'translationsMd5ModuleVar',
  		providerName: 'translationsMd5',
  		providerMethodNameToGetUrl: 'GetStaticTranslationUrlWithMd5',
  		instanceOfProviderMethodNameToGetUrl: 'GetStaticTranslationUrlWithMd5ForControllers',
  	},
  	src: ['static/i18n/*.json'],
  			filter: 'isFile',
  			dest: 'static_source/gen_js/grunt_generated/translationsMd5Provider.js'
  }
}
```
