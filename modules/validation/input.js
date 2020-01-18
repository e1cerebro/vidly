const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)


const validateName = (course) => {

    //create your validation rule
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });

    //validate the request object
    return Joi.validate(course, schema);
}

const validateCustomer = (customer) => {

    //create your validation rule
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().regex(/^[0-9]*$/).min(10).max(15)
    });

    //validate the request object
    return Joi.validate(customer, schema);
}

const validateRental = (rental) => {

    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(rental, schema);
}

const validateUser = (user) => {

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        //password: new PasswordComplexity(complexityOptions)
        password: Joi.string().min(5).max(255).required()
    });

    return Joi.validate(user, schema);

}

const validateLogin = (user) => {

    const schema = Joi.object({
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.string().min(5).max(255).required()
    });

    return Joi.validate(user, schema);

}

module.exports = {
    validateName: validateName,
    validateRental: validateRental,
    validateCustomer: validateCustomer,
    validateUser: validateUser,
    validateLogin: validateLogin
}