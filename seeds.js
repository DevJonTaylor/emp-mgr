global.__rootdir = __dirname
require('dotenv').config()

require = require("esm")(module/*, options*/)
module.exports = require("./src/seeds.js")