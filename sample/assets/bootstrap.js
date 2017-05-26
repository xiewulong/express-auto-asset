/*!
 * bootstrap asset bundle
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/05/15
 * since: 0.0.1
 */
'use strict';

module.exports = {
	sourcePath: '@npm/bootstrap/dist',
	css: [
		'css/bootstrap${extra}.css',
	],
	js: [
		'js/bootstrap${extra}.js',
	],
	depends: [
		'@app/assets/jquery',
	],
	production: {
		extra: '.min'
	},
};
