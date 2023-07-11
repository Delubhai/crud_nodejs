// Define NodeJS Module
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const common = require('./common');
// Define Other Configuration
let transporter = nodemailer.createTransport({
  host: "smtp service",
  port: 465,
  secureConnection: true,
  auth: {
    user: "username",
    pass: "password"
  }
});

// Define Export Module
module.exports = {

  //Send Email For  User Credential
  sendCredential: function (email, password) {
    ejs.renderFile(__dirname + "/../views/email_template/Credentials.ejs", {
      email: email,
      password: password,
      url: process.env.frontendBaseUrl
    }, function (err, data) {
      if (!err) {

        let mailOptions = {
          from: "email id",
          to: email,
          bcc: process.env.bcc_authemail,
          subject: "Account Credentials",
          html: data
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return common.printLog(error, "Error in send credential email");
          }
        });
      } else {
        common.printLog(err, "Error in send credential email");
      }
    });
  },
};
