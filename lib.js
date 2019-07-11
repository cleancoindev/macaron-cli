// make sourcemaps work!
require('source-map-support/register')

module.exports = require("macaron-core/public-exports.js");
module.exports.version = require("macaron-core/package.json").version;
module.exports.to = require("macaron-core/lib/utils/to");
