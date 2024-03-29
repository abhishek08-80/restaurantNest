import {
  Module, forwardRef
} from '@nestjs/common';
import {
  CouponService
} from './coupon.service';
import {
  CouponController
} from './coupon.controller';
import {
  MongooseModule
} from '@nestjs/mongoose';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { CustomerModule } from 'src/customer/customer.module';
import { DishModule } from 'src/dish/dish.module';
import { Coupon, CouponSchema } from 'src/model/coupon.model';

@Module({
  imports: [
     RestaurantModule,
     CustomerModule,
     DishModule,
    MongooseModule.forFeature([
      {
        name: Coupon.name,
        schema: CouponSchema
      },
    ])
  ],

  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService]
})
export class CouponModule { }