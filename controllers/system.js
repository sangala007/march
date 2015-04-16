"use strict";

const
	App        = require('../app'),
	Bookshelf  = App.bookshelf,
	User       = require('../models/user'),
	System     = require('../models/system'),
	SystemUser = require('../models/system_user'),
	util       = require('../lib/util'),
	passport   = require('passport'),
	_          = require('lodash'),
	moment     = require("moment-timezone"),

	timeZonesList = moment.tz.names();

// module.exports = function(app) {
module.exports = {

	/*
	* GET: /system/create
	*/
	create: function(req, res, next) {
		res.render('system/create',{
			timeZonesList: timeZonesList
		});
	},

	/*
	* POST: /system/create
	*/
	postCreate: function(req, res, next) {
		req.assert('name', 'Name cannot be blank.').notEmpty();
		req.assert('timezone', 'Timezone cannot be blank.').notEmpty();

		var errors = req.validationErrors();

		if (errors) {
			req.flash('errors', errors);
			res.render('system/create', {
				params: req.body
			});
			return;
		}

		Bookshelf.transaction(function(t) {
			// 1. Create new system.
			System.forge({
				name     : req.body.name,
				timezone : req.body.timezone,
				suid     : util.generateSUID()			

			}).save(null, {transacting: t}).then(function(systemModel) {
				// 2. Create new system user.
				SystemUser.forge({
					user_id   : req.user.id,
					system_id : systemModel.get('id')

				}).save(null, {transacting: t}).then(function(systemUserModel) {
					t.commit(systemUserModel);

				}).catch(function(e){
					t.rollback(e);
					throw e;
				});

			}).catch(function(e){
				t.rollback(e);
				throw e;
			});

		}).then(function(model) {
			req.flash('success', {msg: 'Success!'});

			// Need to add system.suid to response HEADERS.
			// so CROW can save it on PI.
			// res.redirect('/devices/system/12');

			res.redirect('/system/create');

		}).catch(function(e) {
			logger.log('ERROR saving system:' + e);
			req.flash('errors', {'msg': e.message});
			res.redirect('/system/create');
		});
	},

	/*
	* GET: /system/test
	*/
	test: function(req, res, next) {
		res.render('system/test',{
			timeZonesList: timeZonesList
		});
	},

	/*
	* POST: /system/test
	*/
	postTest: function(req, res, next) {

	}
};

// function insertUser(user, cb) {
// 	bookshelf.transaction(function(t) {
// 		var key = user.key;
// 		Developer.forge({key: key}).fetch({require: true, transacting: t}).then(function(developerModel) {

// 			var devID = developerModel.get('id');
// 			Address.forge(user.address).save(null, {transacting: t}).then(function(addressModel) {
// 				var addressID = addressModel.get('addressId');

// 				Financial.forge(user.financial).save(null, {transacting: t}).then(function(financialModel) {

// 					var financialID = financialModel.get('financialId');
// 					var userEntity = user.personal;
// 					userEntity.addressId = addressID;
// 					userEntity.developerId = devID;
// 					userEntity.financialId = financialId;

// 					User.forge(userEntity).save(null, {transacting: t}).then(function(userModel) {
// 						logger.info('saved user: ', userModel);
// 						logger.info('commiting transaction');
// 						t.commit(userModel);

// 					}).catch(function(err) {
// 						logger.error('Error saving user: ', err);
// 						t.rollback(err);
// 					});

// 				}).catch(function(err) {
// 					logger.error('Error saving financial data: ', err);
// 					t.rollback(err);
// 				})

// 			}).catch(function(err) {
// 				logger.error('Error saving address: ', err);
// 				t.rollback(err);
// 			})

// 		}).catch(function(err) {
// 			logger.error('Error saving business : ', err);
// 			t.rollback(err);
// 		})

// 	}).then(function(model) {
// 		logger.info(model, ' successfully saved');
// 		return Promise.resolve(respond.success({userId: model.get('userId')}));

// 	}).catch(function(err) {
// 		logger.error(err, ' occurred');
// 		return Promise.reject(new DatabaseError('Unable to write user to database due to error ', err.message));
// 	})
// };












