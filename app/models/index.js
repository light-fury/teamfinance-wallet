require('dotenv').config()

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.DATABASE_URI;
db.wallet = require("./wallet.model.js")(mongoose);

module.exports = db;
