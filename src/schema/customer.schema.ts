import * as Joi from 'joi';
  import {Hobbies, Role} from '../utills/enums/enum'
  
export const customerSignupValidation = Joi.object({
  _id: Joi.string().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  password: Joi.string().required().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  // role: Joi.string().valid('Admin','Staff')
  role: Joi.string().valid(...Object.values(Role)),
  hobbies: Joi.array().items(Joi.string().valid(...Object.values(Hobbies))).optional(),
  otp: Joi.number().optional(),
  otpExpiration: Joi.date().optional()
})

export const customerUpdateValidation = Joi.object().keys({
  _id: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional().allow(""),
  newPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  oldPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  confirmPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  hobbies: Joi.array().items(Joi.string().valid(...Object.values(Hobbies))).optional()
})


export const customerResetValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  oldPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password')
})

export const customerForgetValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
      otp: Joi.number(),//.greater(5).less(7).required()
      otpExpiration: Joi.date().optional()
})

export const customerLoginValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
})


export const forgotPasswordEmail = Joi.object().keys({
  email: Joi.string().email().required()
})  