import joi from 'joi';

const validEnvironments = ['development', 'production', 'test'];

const EnvSchemaValidator = joi.object({
  NODE_ENV: joi
    .string()
    .valid(...validEnvironments)
    .required(),
  PORT: joi.number().default(3000),
  // Database
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_DATABASE: joi.string().required(),
  DB_LOGGING: joi.boolean().default(false),
  DB_SCHEMA: joi.string().default('public'),
});

export default EnvSchemaValidator;
