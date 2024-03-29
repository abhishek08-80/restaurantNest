import * as Joi from 'joi';
  import {Category} from '../utills/enums/enum'
  
export const createDishValidation = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  category: Joi.string().valid(...Object.values(Category)),
  restaurantId: Joi.string().required(),
  price: Joi.number().required(),
  isActive: Joi.boolean().optional()
})