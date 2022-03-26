global.__rootdir = __dirname

require = require("esm")(module/*, options*/)
module.exports = require("./src/index.js")