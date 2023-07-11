// Define Common Files
const common = require('../../../../config/common');
const en_TXT = require('../../../../config/apiResponse');
const send_email = require('../../../../config/send_email');
const User = require('../../../models/user.model');
const bcrypt = require('bcrypt');


// Register User
//{req body} Object of User data
//{req headers} timestamp,nonce,token,access_key
exports.signup = async (req, res) => {
  try {
    let currentTime = common.getEpoch();
    // let userType = req.iUserType;

    let userPayload = new User({
      'vFirstName': req?.body?.vFirstName,
      'vLastName': req?.body?.vLastName,
      'vEmail': req?.body?.vEmail,
      'vPhone': req?.body?.vPhone || "",
      'vPassword': await bcrypt.hash(req?.body?.vPassword, 12),
      // 'vJobTitle': req?.body?.vJobTitle || "",
      // 'iUserType': req?.body?.iUserType,
      // 'ParentId': req?.userId,
      // 'iRowsPerPagePreference': req?.body?.iRowsPerPagePreference || 10,
      // 'vVerifyToken': null,
      // 'bIsLinkOpen': false,
      'bIsActive': true,
      'iCreatedAt': currentTime
    });
    // if (userType === 5 || userType === 6) {
    //   userPayload.oCompany = req?.oCompany;
    //   userPayload.CompanyOwnerId = req?.CompanyOwnerId;
    // }
    // else {
    //   if (req?.body?.iUserType === 5 || req?.body?.iUserType === 6) {
    //     userPayload.oCompany = req?.body?.companyId;
    //     userPayload.CompanyOwnerId = req?.body?.companyOwnerId;

    //   } else {
    //     userPayload.oCompany = req?.oCompany;
    //   }
    // }
    let query = { 'vEmail': req?.body?.vEmail };

    //Find if any User have requested Email ID
    await common.findByCaseInsensitive(User, query).exec(async (err, user) => {
      if (err) {
        //If error occurs
        console.log(err, '>>>>>>err')
        return common.commonErrorResponse(res, err);
      }
      if (user != null) {
        // If the user discovers with requested email
        return common.commonResponse(res, { status: false, code: 409, message: en_TXT.acc_alerady_exits });
      } else {
        //If User not found than New User Registered
        userPayload.save(function (err, result) {
          if (err) {
            //If error occurs
            return common.commonErrorResponse(res, err);
          }
          if (result !== null) {
            //Send Email of  Credential to User 
            // send_email.sendCredential(req.body.vEmail, req.body.vPassword);
            //Send Account Activation Link to Email
            // setTimeout(() => {
            //   send_email.verifyAccount(req.body.vEmail);
            // }, 15000);
            //Return success response
            return common.commonSuccessResponse(res, { message: en_TXT.acc_register_success1 });
          } else {
            //if any error in register
            return common.commonResponse(res, { status: false, code: 400, message: en_TXT.acc_register_fail });
          }
        });
      }
    });
  } catch (err) {
    common.printLog(err, "Error in register user api");
    //If any exception occurs
    return common.commonErrorResponse(res, err);
  }
};


// User LogIn 
// {req body} UserName & password
//{req headers} timestamp,nonce,token
exports.login = async (req, res) => {
  try {
    let query = {
      'vEmail': req.body.vEmail
    };
    let join = ""
    let joinOption = ""
    let join2 = ""
    let joinOption2 = ""

    //Determine whether the user exists with the requested email id.
    await common.findByCaseInsensitiveWithJoin(User, query, join, joinOption, join2, joinOption2).exec(async (err, user) => {
      if (err) {
        //If error occurs
        return common.commonErrorResponse(res, err);
      }
      if (user != null) {
        //If the user discovers it, the password should be checked.
        console.log(user, req.body.vPassword, '>>>>>>>>>req.body.vPassword')
        const checkpass = await bcrypt.compare(req.body.vPassword, user?.vPassword);
        //If password matched
        if (checkpass) {
          //Check to see if the user's temperaory is delted or not.
          if (user?.bIsDelete === false) {
            let payload = {
              _id: user?._id,
              vEmail: user?.vEmail,
              // CompanyOwnerId: user?.CompanyOwnerId?._id
            };
            //Generate Access Token
            const accessToken = common.accessToken(payload);
            let query = {
              _id: user?._id
            };
            let updatedata = {
              vAccessToken: accessToken
            };
            let filter = {
              new: true
            };
            //Update Token in Database
            common.updateQuery(User, query, updatedata, filter).exec(async (err, updatedUser) => {
              if (err) {
                // If an error occurs
                return common.commonErrorResponse(res, err);
              }
              if (updatedUser) {
                let logedInUser = {
                  "_id": updatedUser?._id,
                  // "vFirstName": updatedUser?.vFirstName,
                  // "vLastName": updatedUser?.vLastName,
                  "vEmail": updatedUser?.vEmail,
                  "vPhone": updatedUser?.vPhone,
                  // "vJobTitle": updatedUser?.vJobTitle,
                  "vAccessToken": updatedUser?.vAccessToken,
                  // "CompanyOwnerId": updatedUser?.CompanyOwnerId,
                  // "oCompany": updatedUser?.oCompany,
                  // "oUserSettings": updatedUser?.oUserSettings,
                  // "bIsOverridePrice": user?.oCompany?.bIsOverridePrice,
                  // "iUserRole": updatedUser?.iUserType
                };

                //Return success Response
                return common.commonSuccessResponse(res, { message: en_TXT.acc_login_succss, user: logedInUser });
              }
            });
          }
          else {
            //If User temparory Deleted.
            //Return failure response
            return common.commonResponse(res, { status: false, code: 401, message: en_TXT.acc_unable_login });
          }
        } else {
          //If password does not match
          return common.commonResponse(res, { status: false, code: 401, message: en_TXT.acc_login_fail });
        }
      } else {
        //If user not found
        return common.commonResponse(res, { status: false, code: 404, message: en_TXT.acc_not_exists });
      }
    });
  }
  catch (err) {
    // common.printLog(err, "Error in user login api");
    //If any exception occurs
    return common.commonErrorResponse(res, err);
  }
};

//Check whether the AccessToken is valid or not.
//{req headers} timestamp,nonce,token,access_key
exports.checkAccessToken = async (req, res) => {
  try {
    //If Valid AccessToken
    return common.commonSuccessResponse(res, { message: "Token is valid." });
  } catch (err) {
    common.printLog(err, "Error in check access token api");
    //If any exception occurs
    return common.commonErrorResponse(res, err);
  }
};

// Forgot Password 
// {req body} Email Id
//{req headers} timestamp,nonce,token
exports.forgotPassword = async (req, res) => {
  try {
    let query = {
      'vEmail': req.body.vEmail
    };
    //Check to see if the user is registered with the requested email address.
    common.findByQuary(User, query).exec((err, user) => {
      if (err) {
        // If an error occurs
        return common.commonErrorResponse(res, err);
      }
      if (user != null) {
        //If User Found
        let payload = {
          vEmail: req.body.vEmail
        };
        //forget token genrerate
        let forget_token = common.encryptVerifyToken(payload);

        let updateData = {
          vForgetToken: forget_token,
          bIsLinkOpen: false
        };
        let query = {
          _id: user._id
        }
        let filter = {
          new: true
        };

        //update a forgotten token in the database
        common.updateQuery(User, query, updateData, filter).exec((err, updatedUser) => {
          if (err) {
            // If an error occurs
            return common.commonErrorResponse(res, err);
          }
          if (updatedUser != null) {
            //send a link to reset your password to your registered email address
            send_email.forgetpassword(user.vEmail, forget_token);

            //Retuen success response
            return common.commonSuccessResponse(res, { message: en_TXT.acc_forgot_success + req.body.vEmail });
          }
          else {
            // If an error occurs
            return common.commonResponse(res, { status: false, code: 400, message: en_TXT.acc_forgot_failed });
          }
        });
      } else {
        //If the user is unable to be find
        return common.commonResponse(res, { status: false, code: 400, message: en_TXT.acc_forgot_failed });
      }
    });
  } catch (err) {
    common.printLog(err, "Error in forget user password api");
    //If any exception occurs
    return common.commonErrorResponse(res, err);
  }
};

//Reset Password
// {req body} New Password
//{req params} forgot Token
//{req headers} timestamp,nonce,token
exports.resetPassword = async (req, res) => {
  try {
    let token = req.params.token;
    let query = {
      'vForgetToken': token
    };
    //check to see if the user exists with the given token
    common.findByQuary(User, query).exec(async (err, user) => {
      if (err) {
        //If an error occurs
        return common.commonErrorResponse(res, err);
      }
      if (user != null) {
        //If the user discovers
        let password = await bcrypt.hash(req.body.vPassword, 12);
        let query = {
          _id: user._id
        }
        let updateData = {
          vPassword: password,
          vForgetToken: null
        };
        let filter = {
          new: true
        };
        //In the database, update the user with a new password.
        common.updateQuery(User, query, updateData, filter).exec((err, updatedUser) => {
          if (err) {
            //If an error occurs
            return common.commonErrorResponse(res, err);
          }
          if (updatedUser != null) {
            //If the password reset is successful
            //Retuen success response
            return common.commonSuccessResponse(res, { message: en_TXT.acc_reset_success });
          } else {
            //If the password is not reset
            //Return failure response
            return common.commonResponse(res, { status: false, code: 400, message: en_TXT.acc_reset_fail });
          }
        });
      } else {
        //If an error occurs
        return common.commonResponse(res, { status: false, code: 400, message: en_TXT.acc_link_invalid });
      }
    });
  } catch (err) {
    common.printLog(err, "Error in reset user password api");
    //If any exception occurs
    return common.commonErrorResponse(res, err);
  }
};

exports.userList = async (req, res) => {
  try {
    let users =await User.find({})
    console.log(users, '>>>>>>>.users')
    return res.status(200).send({ data: users })
  } catch (error) {
    console.log(error, "userlist error");
    return res.status(200).send({ message: "Internal server error" })
  }
}
