import * as Joi from 'joi';
  import { Status} from '../utills/enums/enum'
  
export const createOrderValidation = Joi.object({
  _id: Joi.string().optional(),
  totalPrice: Joi.number().optional(),
  customerId: Joi.string().required(),
  restaurantId: Joi.string().required(),
  couponCode: Joi.string().optional(),
  count: Joi.number().optional(),
  orderStatus: Joi.string().valid(...Object.values(Status)).optional(),
  dishId: Joi.array().items(Joi.string()).optional()
})