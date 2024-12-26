import Joi from 'joi';

// Define the validation schema
export const authValidationSchema = Joi.object({
  Email: Joi.string()
    .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
    .required()
    .messages({
      'string.base': 'Email should be a type of text',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please fill a valid email address',
      'any.required': 'Email is required',
    }),

  Password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      'string.base': 'Password should be a type of text',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
});


export const updateValidationSchema = Joi.object({
  Email: Joi.string()
    .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
    .optional()
    .messages({
      'string.base': 'Email should be a type of text',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please fill a valid email address',
    }),

  Password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .optional()
    .messages({
      'string.base': 'Password should be a type of text',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character',
    }),

  UserName: Joi.string()
    .optional()
    .messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username cannot be empty',
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided.'
});



export const applyNewPasswordValidationSchema = Joi.object({
  resetPasswordToken:Joi.string().required().
  messages({
    "string.empty":"token is required"
  }),
  otp:Joi.string().max(4).required().
  messages({
    "string.empty":"otp is required",
    "string.max":"otp must be 4 characters long",
  }),
  newPassword:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).required().
  messages({
    "string.empty":"newPassword is required",
    "string.pattern.base":"new password must be at least 8 characters long and contain at least one letter, one number, and one special character",
  })
});