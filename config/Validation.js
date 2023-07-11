const {
  check
} = require('express-validator');
const {
  body
} = require('express-validator');

exports.signupValidation = [
  body('vFirstName', 'FirstName is required').exists().notEmpty().matches(/^[a-zA-Z. ]*$/).withMessage('Only Characters with white space are allowed in firstname'),
  body('vLastName', 'LastName is required').exists().notEmpty().matches(/^[a-zA-Z. ]*$/).withMessage('Only Characters with white space are allowed in lastname'),
  body('vEmail', 'Please include a valid email').isEmail().normalizeEmail({
    gmail_remove_dots: true
  }),
  body('vPassword', 'Password must be 6 or more characters').isLength({
    min: 6
  }),
  body('iUserType', 'UserType is required').exists().notEmpty(),
  body('iUserType', 'UserType is only include numbers.').isInt()
]

exports.loginValidation = [
  body('vEmail', 'Please include a valid email').isEmail().normalizeEmail({
    gmail_remove_dots: true
  }),
  body('vPassword', 'Password must be 6 or more characters').isLength({
    min: 6
  }),
  body('vEmail', 'Email is required').exists().notEmpty(),
]

exports.forgetpasswordValidation = [
  body('vEmail', 'Please include a valid email').isEmail().normalizeEmail({
    gmail_remove_dots: true
  }),
  body('vEmail', 'Email is required').exists().notEmpty(),
]

exports.resetpasswordValidation = [
  body('vPassword', 'Password is required').exists().notEmpty(),
]
exports.faqValidation = [
  body('vTitle', 'Title is required').exists(),
  body('vDescription', 'Description is required').exists(),
  body('vTitle', 'fill value in Title field').notEmpty(),
  body('vDescription', 'fill value in Description field').notEmpty()
]
