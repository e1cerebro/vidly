const Joi = require('joi')

const validateName = (course) => {

    //create your validation rule
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    //validate the request object
    return Joi.validate(course, schema);
}

module.exports.validateName = validateName;