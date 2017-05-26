/*!
 * jquery asset bundle
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/05/08
 * since: 0.0.1
 */
'use strict';

module.exports = {
	sourcePath: '@npm/jquery/dist',
	js: [
		'jquery${extra}.js',
	],
	production: {
		extra: '.min'
	},
};
