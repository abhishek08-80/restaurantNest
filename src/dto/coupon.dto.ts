import {
    PartialType
  } from '@nestjs/mapped-types';
  import { Status} from '../utills/enums/enum'
  
  
  export class CreateCouponDto {
    id: String;
    couponCode: String;
    couponDiscription: String;
    discountInPercentage: Number;
    startDate: Date;
    endDate: Date;
  }

  