export const errorMiddleware = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: error.message
    });
};
