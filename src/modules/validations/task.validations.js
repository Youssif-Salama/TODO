import Joi from "joi";

export const addTaskValidationSchema = Joi.object({
  Title: Joi.string().required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "any.required": "Title is a required field.",
  }),
  Description: Joi.string().required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description is required.",
    "any.required": "Description is a required field.",
  }),
  DueDate: Joi.date().iso().required().messages({
    "date.base": "DueDate must be a valid date.",
    "any.required": "DueDate is a required field.",
    "date.format": "DueDate must be in ISO format.",
  }),
  Creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Creator must be a valid ObjectId.",
      "string.empty": "Creator is required.",
      "any.required": "Creator is a required field.",
    }),
});

export const updateTaskValidationSchema = Joi.object({
  Title: Joi.string().optional().messages({
    "string.base": "Title must be a string.",
  }),
  Description: Joi.string().optional().messages({
    "string.base": "Description must be a string.",
  }),
  DueDate: Joi.date().iso().optional().messages({
    "date.base": "DueDate must be a valid date.",
    "date.format": "DueDate must be in ISO format.",
  }),
  Creator: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Creator must be a valid ObjectId.",
    }),
  isCompleted: Joi.boolean().optional().messages({
    "boolean.base": "isCompleted must be a boolean value.",
  }),
});
