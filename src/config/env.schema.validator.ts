import joi from 'joi';

const validEnvironments = ['development', 'production', 'test'];

const EnvSchemaValidator = joi.object({
  NODE_ENV: joi.string().valid(...validEnvironments).required(),
  PORT: joi.number().default(3000),
});

export default EnvSchemaValidator;
