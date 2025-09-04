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
  // Contentful
  CONTENTFUL_BASE_URL: joi.string().uri().required(),
  CONTENTFUL_SPACE_ID: joi.string().required(),
  CONTENTFUL_ACCESS_TOKEN: joi.string().required(),
  CONTENTFUL_ENVIRONMENT: joi.string().required(),
  CONTENTFUL_CONTENT_TYPE: joi.string().required(),
  // Cron
  CRON_FETCH_PRODUCTS: joi.string().required(),
});

export default EnvSchemaValidator;
