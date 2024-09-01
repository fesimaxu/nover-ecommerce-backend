import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .default('test')
    .valid('local', 'development', 'production', 'staging', 'test')
    .required(),
  PORT: Joi.number().default(3000),
});
