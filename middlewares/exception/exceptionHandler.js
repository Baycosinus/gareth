const Exception = require("../../models/misc/Exception");

function handleException(err, req, res, next) {
    console.log(err);
    return new Exception(err.message, 500);
}

module.exports = {
    handleException
}