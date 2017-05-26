/*!
 * common asset bundle
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/05/08
 * since: 0.0.1
 */
'use strict';

module.exports = {
	// basePath: '@webroot',
	// baseUrl: '@web',
	css: [
		'css/common${extra}.css',
	],
	cssOptions: {
		noscript: true,
	},
	js: [
		'js/common${extra}.js',
	],
	jsOptions: {
		beforeHeadEnd: true,
		condition: 'lt !IE 9',
	},
	depends: [
		'@app/assets/jquery',
		'@app/assets/bootstrap',
	],
	production: {
		extra: '.min'
	},
};
