const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSettings = {
    'bIsNewCustomer': {
        type: Boolean,
        default: false
    },
    'bIncludeCover': {
        type: Boolean,
    },
    'bIncludeTnC': {
        type: Boolean,
        default: false
    },
    'bIncludeMP': {
        type: Boolean,
        default: false
    },
    'bIncludeListPrice': {
        type: Boolean,
        default: false
    },
    'iTermLength': {
        type: Number,
        default: 5
    }
}

//User Schema
const userSchema = mongoose.Schema({
    'vFirstName': {
        type: String,
        // required: [true, 'Required'],
    },
    'vLastName': {
        type: String,
        // required: [true, 'Required'],
    },
    'vEmail': {
        type: String,
        required: [true, 'Required']
    },
    'vPhone': {
        type: String,
    },
    'vPassword': {
        type: String,
        required: [true, 'Required'],
    },
    'oCompany': {
        type: ObjectId,
        ref: "Company",
        default: null
    },
    'CompanyOwnerId': {
        type: ObjectId,
        ref: "User",
        default: null
    },
    'iUserType': {
        type: Number,
        required: [true, 'Required']
    },
    'vJobTitle': {
        type: String,
    },
    'oUserSettings': userSettings,
    'iRowsPerPagePreference': {
        type: Number,
    },
    'vAccessToken': {
        type: String,
        required: false,
        default: null
    },
    'vRefreshToken': {
        type: String,
        required: false,
        default: null
    },
    'vVerifyToken': {
        type: String,
        required: false,
        default: null
    },
    'vForgetToken': {
        type: String,
        required: false,
        default: null
    },
    'iAccessTokenExpires': {
        type: Number,
        required: false,
        default: null
    },
    'iRefreshTokenExpires': {
        type: Number,
        required: false,
        default: null
    },
    'bIsLinkOpen': {
        type: Boolean,
        default: false
    },
    'bIsActive': {
        type: Boolean,
        default: false
    },
    'bIsDelete': {
        type: Boolean,
        default: false
    },
    'ParentId': {
        type: ObjectId,
        ref: "User",
    },
    'iCreatedAt': {
        type: Number,
        required: [true, 'Required'],
    },
    'iUpdatedAt': {
        type: Number,
        default: null
    }
});

let User = mongoose.model('User', userSchema);
module.exports = User;
