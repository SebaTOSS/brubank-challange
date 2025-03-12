import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        BILLING_NATIONAL_RATE: Joi.number()
          .min(0)
          .required()
          .messages({
            'number.base': 'BILLING_NATIONAL_RATE must be a number',
            'number.min': 'BILLING_NATIONAL_RATE cannot be negative',
            'any.required': 'BILLING_NATIONAL_RATE is required',
          }),
        BILLING_INTERNATIONAL_RATE: Joi.number()
          .min(0)
          .required()
          .messages({
            'number.base': 'BILLING_INTERNATIONAL_RATE must be a number',
            'number.min': 'BILLING_INTERNATIONAL_RATE cannot be negative',
            'any.required': 'BILLING_INTERNATIONAL_RATE is required',
          }),
        BILLING_FREE_FRIEND_CALLS: Joi.number()
          .integer()
          .min(0)
          .required()
          .messages({
            'number.base': 'BILLING_FREE_FRIEND_CALLS must be a number',
            'number.integer': 'BILLING_FREE_FRIEND_CALLS must be an integer',
            'number.min': 'BILLING_FREE_FRIEND_CALLS cannot be negative',
            'any.required': 'BILLING_FREE_FRIEND_CALLS is required',
          }),
      }),
      load: [
        () => ({
          BILLING_NATIONAL_RATE: Number(process.env.BILLING_NATIONAL_RATE),
          BILLING_INTERNATIONAL_RATE: Number(process.env.BILLING_INTERNATIONAL_RATE),
          BILLING_FREE_FRIEND_CALLS: Number(process.env.BILLING_FREE_FRIEND_CALLS),
        }),
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule { }