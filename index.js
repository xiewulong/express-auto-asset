/*!
 * Asset
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/05/09
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const path = require('path');

const crc32 = require('crc32');
const express = require('express');
const mkdirp = require('mkdirp');

const defaultOptions = {
	basePath: '@static',
	baseUrl: '@web',
	publishPath: 'assets',
	timestamp: false,
	linkTemplate: '<link rel="stylesheet" href="${href}">',
	scriptTemplate: '<script src="${src}"></script>',
};

class Asset {

	constructor(app, options = {}) {
		if(!app) {
			console.error('app is required');

			return;
		}

		this.options = Object.assign(defaultOptions, options);

		this.assets = {};

		this.app = app;
		this.app.locals.asset = this;

		return this.app;
	}

	use(bundlePath) {
		if(this.assets[bundlePath]) {
			return this.assets[bundlePath];
		}

		let bundle = require(this.app.alias(bundlePath));
		bundle.env = bundle[this.app.get('env')] || {};

		let allCssBeforeHeadEnd = [];
		let allJsBeforeHeadEnd = [];
		let allJsBeforeBodyEnd = [];
		bundle.depends && bundle.depends.forEach((depend) => {
			let dependAsset = this.use(depend);
			allCssBeforeHeadEnd.push(dependAsset.cssBeforeHeadEnd);
			allJsBeforeHeadEnd.push(dependAsset.jsBeforeHeadEnd);
			allJsBeforeBodyEnd.push(dependAsset.jsBeforeBodyEnd);
		});
		bundle.sourcePath && this.publish(bundle);

		let cssBeforeHeadEnd = [];
		let jsBeforeHeadEnd = [];
		let jsBeforeBodyEnd = [];
		let basePath = bundle.basePath || this.options.basePath;
		let baseUrl = bundle.baseUrl || this.options.baseUrl;
		let extra = bundle.env.extra || bundle.extra || '';
		if(bundle.css) {
			let cssOptions = bundle.cssOptions || {};
			bundle.css.forEach((css) => {
				cssBeforeHeadEnd.push(this.renderCss(this.app.alias(`${baseUrl}/${css.replace('${extra}', extra)}`), cssOptions.condition, cssOptions.noscript));
			});
			cssBeforeHeadEnd = cssBeforeHeadEnd.join('');
			allCssBeforeHeadEnd.push(cssBeforeHeadEnd);
		}
		if(bundle.js) {
			let jsOptions = bundle.jsOptions || {};
			bundle.js.forEach((js) => {
				let html = this.renderJs(this.app.alias(`${baseUrl}/${js.replace('${extra}', extra)}`), jsOptions.condition);
				jsOptions.beforeHeadEnd ? jsBeforeHeadEnd.push(html) : jsBeforeBodyEnd.push(html)
			});
			jsBeforeHeadEnd = jsBeforeHeadEnd.join('');
			jsBeforeBodyEnd = jsBeforeBodyEnd.join('');
			allJsBeforeHeadEnd.push(jsBeforeHeadEnd);
			allJsBeforeBodyEnd.push(jsBeforeBodyEnd);
		}

		return this.assets[bundlePath] = {
			cssBeforeHeadEnd,
			jsBeforeHeadEnd,
			jsBeforeBodyEnd,
			head: allCssBeforeHeadEnd.concat(allJsBeforeHeadEnd).join(''),
			body: allJsBeforeBodyEnd.join(''),
		};
	}

	renderJs(src, condition = '') {
		let script = this.options.scriptTemplate.replace('${src}', src);
		if(condition) {
			return this.wrapIntoCondition(script, condition);
		}
		return script;
	}

	renderCss(href, condition = '', noscript = false) {
		let link = this.options.linkTemplate.replace('${href}', href);
		if(condition) {
			return this.wrapIntoCondition(link, condition);
		} else if(noscript) {
			return `<noscript>${link}</noscript>`;
		}
		return link;
	}

	wrapIntoCondition(content, condition) {
		if(/!ie/i.test(condition)) {
			return `<!--[if ${condition}]><!-->${content}<!--<![endif]-->`;
		}
		return `<!--[if ${condition}]>${content}<![endif]-->`;
	}

	publish(bundle) {
		if(!bundle.sourcePath) {
			return;
		}

		let sourcePath = this.app.alias(bundle.sourcePath);
		let basename = bundle.name || this.hash(sourcePath);
		bundle.basePath = this.app.alias(`${this.options.basePath}/${this.options.publishPath}/${basename}`);
		bundle.baseUrl = this.app.alias(`${this.options.baseUrl}/${this.options.publishPath}/${basename}`);
		if(fs.existsSync(bundle.basePath)) {
			return;
		}

		let dirname = path.dirname(bundle.basePath);
		if(!fs.existsSync(dirname)) {
			mkdirp.sync(dirname);
		}

		fs.symlinkSync(sourcePath, bundle.basePath, 'dir');
	}

	hash(sourcePath) {
		if(typeof this.options.hash === 'function') {
			return this.options.hash(sourcePath);
		}

		let stat = fs.statSync(sourcePath);
		return crc32(`${sourcePath}${stat.mtime}`);
	}

}

express.application.autoAsset = function(options = {}) {
	return new Asset(this, options);
};

module.exports = (app, options = {}) => {
	return new Asset(app, options);
};
