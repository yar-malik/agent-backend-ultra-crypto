import Joi from 'joi';

export const registerValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    domain: Joi.string().required(),
});

export const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});