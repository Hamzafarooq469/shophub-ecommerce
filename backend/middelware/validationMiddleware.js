
// validationMiddleware.js
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            // Send error message back to client
            return res.status(400).json({
                message: error.details.map(err => err.message).join(', '),
            });
        }
        next(); // Proceed to the next middleware/route handler
    };
};

module.exports = validationMiddleware;
