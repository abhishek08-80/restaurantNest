import * as Joi from 'joi';
  import {Hobbies, Role} from '../utills/enums/enum'
  
export const restaurantSignupValidation = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  password: Joi.string().required().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  isActive: Joi.string().optional(),
  otp: Joi.number().optional(),
  otpExpiration: Joi.date().optional(),
  startTime: Joi.number().min(0).max(23),
  endTime: Joi.number().min(0).max(23.59).greater(Joi.ref('startTime'))
})
 

export const restaurantUpdateValidation = Joi.object().keys({
  _id: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional().allow(""),
  newPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  oldPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
  confirmPassword: Joi.string().optional().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
  'password'),
})


export const restaurantResetValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  oldPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password')
})

export const restaurantForgetValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
  confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
      otp: Joi.number(),//.greater(5).less(7).required()
      otpExpiration: Joi.date().optional()
})

export const restaurantLoginValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
      'password'),
})


export const forgotPasswordEmail = Joi.object().keys({
  email: Joi.string().email().required()
})  