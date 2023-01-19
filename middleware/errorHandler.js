module.exports = (error, req, res, next) => {

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message: error.message,
            validation: error.validation,
        }
    });

}
