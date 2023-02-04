const express = require('express')
const app = express()
const port = 3000

const { handleException } = require('./middlewares/exception/exceptionHandler')
const { validateRequest } = require('./middlewares/validator/requestValidator')

// Parse Query Param & Body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    validateRequest(req, res, next);
})

app.use((err, req, res, next) => {
    var error = handleException(err, req, res, next);
    res.status(error.httpStatusCode).send(error.message);
})

app.use('/ethereum', require('./routes/ethereum'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})