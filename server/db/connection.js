const monk = require('monk');
const db = monk('localhost/emojiramen');

module.exports = db;
