
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).required(), // Minimum 3 characters
    description: Joi.string().min(10).required(), // Minimum 10 characters
    color: Joi.string().required(), // Required field
    category: Joi.string().required(), // Required field
    price: Joi.number().greater(0).required(), // Price must be greater than 0
    stock: Joi.number().integer().greater(0).min(0).required(), // Stock must be a non-negative integer
});

module.exports = productSchema; // Exporting the schema
