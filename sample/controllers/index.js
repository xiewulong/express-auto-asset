/*!
 * home
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/05/26
 * since: 0.0.1
 */
'use strict';

module.exports = {

	index(req, res, next) {
		res.render('home', {
			title: 'foo home',
		});
	},

};
