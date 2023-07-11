// Define Common Files
let jwt = require('jsonwebtoken');
const {
  validationResult
} = require('express-validator');
const uuid4 = require('uuid4');
const crypto = require('crypto');
const User = require('../app/models/user.model');
const Role = require('../app/models/role.model');
const _ = require("lodash");
const en_TXT = require('./apiResponse');
const {
  async
} = require('q');

let common = module.exports = {

  //Get Epoch Time
  getEpoch: function () {
    let d = new Date();
    let TiDt = Math.round(d.getTime() / 1000);
    return TiDt;
  },
  //Console Log
  printLog: function (data, message) {
    if (data != null && data != "" && data) {
      console.log(data, message);
    } else {
      console.log(message);
    }
  },
  commonSuccessResponse: function (res, data) {
    let obj = data;
    obj['status'] = en_TXT.status_success;
    obj['code'] = 200;
    return res.status(200).send(obj);
  },
  commonErrorResponse: function (res, message) {
    return res.status(200).send({
      status: en_TXT.status_failed,
      code: 500,
      message: message
    });
  },
  commonResponse: function (res, data) {
    return res.status(200).send(data);
  },
  //Phone Number Formatter
  PhoneNumberFormatter: function (number) {
    let phoneNumber = "(" + number.slice(0, 3) + ") " + number.slice(3, 6) + "-" + number.slice(6, 10);
    return phoneNumber;
  },
  //Check Module Access Based on Role
  checkModuleAcess: function (module) {
    return async function (req, res, next) {
      let role = "";
      if (req.iUserType == "1") {
        role = "bSuperAdmin";
      } else if (req.iUserType == "2") {
        role = "bManagingAdmin";
      } else if (req.iUserType == "3") {
        role = "bAdmin";
      } else if (req.iUserType == "4") {
        role = "bEsiUser";
      } else if (req.iUserType == "5") {
        role = "bPartnerAdmin";
      } else if (req.iUserType == "6") {
        role = "bPartnerUser";
      } else {
        return res.status(200).send({
          status: false,
          code: 401,
          message: "Unauthorized Access"
        });
      }

      let where = {
        'vModule': module
      };
      let result = await outerFindByQuary(Role, where);

      if (result) {
        if (result[role]) {
          next();
        } else {
          return res.status(200).send({
            status: false,
            code: 401,
            message: "Unauthorized Access"
          });
        }
      } else {
        return res.status(200).send({
          status: false,
          code: 401,
          message: "Unauthorized Access"
        });
      }
    }
  },

  //generate token
  encryptVerifyToken: function (pass) {
    let user_token = uuid4(pass);
    return user_token;
  },

  //generate Access Token
  accessToken: function (data) {
    return jwt.sign({
      data: data
    }, process.env.secretKey, {
      expiresIn: '24h'
    });
  },


  //verify Authentication token
  verifyAuthenticationToken: async function (req, res, next) {
    let nonce = req.headers['nonce'];
    let timestamp = req.headers['timestamp'];
    let getToken = req.headers['token'];
    let token = await generateToken(nonce, timestamp);
    if (!getToken || !nonce || !timestamp) {
      return res.status(401).send({
        status: false,
        code: 401,
        message: "No Token provided."
      });
    } else if (getToken != token) {
      return res.status(401).send({
        status: false,
        code: 401,
        message: "Failed to authenticate Token."
      });
    } else {
      next();
    }
  },

  //verify Access token
  verifyAccessToken: async function (req, res, next) {
    let get_access_key = req.headers['access_key'];
    if (!get_access_key) {
      return res.status(401).send({
        status: false,
        code: 401,
        message: "No Access Token provided."
      });
    } else {
      await jwt.verify(get_access_key, process.env.secretKey, async (err, decoded) => {
        if (err) {
          return res.status(401).send({
            status: false,
            code: 401,
            message: "Invalid Access Token."
          });
        }
        userId = decoded.data._id;
        let query = {
          _id: userId
        };
        const user = await User.findOne(query);
        if (user === null) {
          return res.status(401).send({
            status: false,
            code: 401,
            message: "User Is Not Exits."
          });
        } else {
          req.Name = user.vFirstName + " " + user.vLastName;
          req.userId = user._id;
          req.userEmail = user.vEmail;
          req.CompanyOwnerId = user.CompanyOwnerId;
          req.iUserType = user.iUserType;
          req.oCompany = user.oCompany;
          req.userSetting = user?.oUserSettings;
          next();
        }
      });
    }
  },

  //Find One  Using Query
  findByQuary: function (tablename, quary) {
    let user = tablename.findOne(quary);
    if (user !== null) {
      return user;
    } else {
      return null;
    }
  },

  //Find One  Using Query and CaseInsensitive
  findByCaseInsensitive: function (tablename, quary) {
    let user = tablename.findOne(quary).collation({
      locale: "en",
      strength: 2
    });
    if (user !== null) {
      return user;
    } else {
      return null;
    }
  },

  //Find using query with two populate and select option
  findByCaseInsensitiveWithJoin: function (tablename, query, join, joinOption, join2, joinOption2) {
    let result = tablename.findOne(query).collation({
      locale: "en",
      strength: 2
    }).populate(join, joinOption).populate(join2, joinOption2);
    if (result !== null) {
      return result;
    } else {
      return null;
    }
  },
  //Find using aggregation
  findByAggregate: function (tablename, quary) {
    return new Promise((resolve, reject) => {
      tablename.aggregate(quary).exec((err, Data) => {
        if (err) {
          resolve({
            status: false,
            data: err
          });
        }
        resolve({
          status: true,
          data: Data
        });
      });
    });
  },

  //Find using aggregation with Searching and sorting
  findByAggregateFilter: function (tablename, quary, option) {
    return new Promise((resolve, reject) => {
      tablename.aggregate(quary, option).exec((err, Data) => {
        if (err) {
          resolve({
            status: false,
            data: err
          });
        }
        resolve({
          status: true,
          data: Data
        });
      });
    });
  },

  //Find using query
  findusersByQuary: function (tablename, quary) {
    let user = tablename.find(quary).sort({
      iCreatedAt: -1
    });
    if (user !== null) {
      return user;
    } else {
      return null;
    }
  },

  //Find using query
  findusersByQuarySort: function (tablename, quary) {
    let user = tablename.find(quary).sort({
      iCreatedAt: 1
    });
    if (user !== null) {
      return user;
    } else {
      return null;
    }
  },

  //Find using query with select option
  findQuerySelect: function (tablename, query, option) {
    let result = tablename.find(query).select(option).sort({ iCreatedAt: -1 });
    if (result !== null) {
      return result;
    } else {
      return null;
    }
  },

  //Find using query with two populate and select option
  findQuerySelectJointwo: function (tablename, query, join, joinOption, join2, joinOption2) {
    let result = tablename.findOne(query).populate(join, joinOption).populate(join2, joinOption2);
    if (result !== null) {
      return result;
    } else {
      return null;
    }
  },


  //Find using query with two populate
  findQuerySelectJoinTwopopulate: function (tablename, query, join, joinTwo) {

    let result = tablename.find(query).populate(join).populate(joinTwo).sort({
      iCreatedAt: -1
    });
    if (result !== null) {
      return result;
    } else {
      return null;
    }
  },

  //Find using query with three populate
  findQuerySelectJoinThreepopulate: function (tablename, query, join, joinTwo, joinThree) {

    let result = tablename.find(query).populate(join).populate(joinTwo).populate(joinThree).sort({
      iCreatedAt: -1
    });
    if (result !== null) {
      return result;
    } else {
      return null;
    }
  },

  //Find using query with one populate and select option
  findQuerySelectOneJoin: function (tablename, query, join, joinOption) {
    let result = tablename.find(query).populate(join, joinOption);
    if (result) {
      return result;
    } else {
      return null;
    }
  },

  //Update using query , updatedata and filter
  updateQuery: function (tablename, quary, data, arrayFilters) {
    let user = tablename.findOneAndUpdate(quary, data, arrayFilters);
    return user;
  },

  //Update one using query , updatedata
  updateOne: function (tableName, query, newValue) {
    let result = tableName.updateOne(query, {
      $set: newValue
    });
    return result;
  },
  //Update many using query , updatedata and filter
  updateMany: function (tableName, query, newValue, arrayFilters) {
    let result = tableName.updateMany(query, {
      $set: newValue
    }, arrayFilters);
    return result;
  },

  //Delete many using query
  deleteMany: function (tableName, query) {
    let result = tableName.deleteMany(query);
    return result;
  },

  //Delete using query
  deleteQuery: function (tablename, quary) {
    let user = tablename.findOneAndDelete(quary, {
      new: true
    });
    return user;
  },

  //API Validation
  apiValidation: function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        status: false,
        code: 400,
        message: errors.array()[0]?.msg
      });
      //error.errors[0].msg
    }
    next();
  },
};

//Generate Token function
async function generateToken(nonce, timestamp) {
  return new Promise((resolve, reject) => {
    let privateKey = process.env.privateKey;
    let secretKey = process.env.secretKey;
    let hmac = crypto.createHmac('sha256', privateKey);
    let signed = hmac.update(secretKey + timestamp + nonce).digest("hex");
    resolve(signed);
  })
};

//Find Role using module
async function outerFindByQuary(tablename, quary) {


  return new Promise((resolve, reject) => {
    let user = tablename.findOne(quary);
    if (!user) {
      resolve(null);
    } else {
      resolve(user);
    }
  })
};
