const env = process.env;

env.APP_PORT = '3000';
env.NODE_ENV = 'development';

env.DB_CONNECTION = 'test';
env.DB_HOST = '0.0.0.0';
env.DB_PORT = '5432';
env.DB_USERNAME = 'postgres';
env.DB_PASSWORD = 'mysecretpassword';
env.DB_DATABASE = 'mydatabase';
env.DB_LOGGING = 'true';

env.CONTENTFUL_BASE_URL = 'https://cdn.contentful.com';
env.CONTENTFUL_SPACE_ID = 'some-space';
env.CONTENTFUL_ACCESS_TOKEN = 'some-token';
env.CONTENTFUL_ENVIRONMENT = 'master';
env.CONTENTFUL_CONTENT_TYPE = 'product';
