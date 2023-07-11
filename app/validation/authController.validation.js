const { body } = require('express-validator');

exports.validate = (req) => {
	switch (req) {

		case 'login': {
			return [
				body('vEmail', "User email is doesn't exists.").exists(),
				body('vPassword', "User password is doesn't match.").exists(),
			]
		}
		case 'forgotPassword': {
			return [
				body('vEmail', "User email is doesn't exists.").exists(),
			]
		}
		case 'resetPassword': {
			return [
				body('vPassword', "User password is doesn't exists.").exists(),
			]
		}
	}
}
