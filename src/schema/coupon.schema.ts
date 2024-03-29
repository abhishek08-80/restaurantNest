import * as Joi from 'joi';
  
export const createCouponValidation = Joi.object({
  _id: Joi.string().optional(),
  couponCode: Joi.string().required(),
  couponDiscription: Joi.string().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  discountInPercentage: Joi.number().required()
})