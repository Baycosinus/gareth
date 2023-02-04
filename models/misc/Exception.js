class Exception extends Error {
    constructor(message, statusCode) {
        super(message);
        this.httpStatusCode = statusCode
    }
}

module.exports = Exception;