import {
    PartialType
  } from '@nestjs/mapped-types';
  import { Status} from '../utills/enums/enum'
  
  
  export class CreateOrderDto {
    id: String;
    totalPrice: Number;
    customerId: String;
    restaurantId: String;
    dishId: [String];
    couponCode: String;
    count: Number;
    orderStatus: Status;
  }

  