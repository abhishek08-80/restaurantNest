import {
  Module, forwardRef
} from '@nestjs/common';
import {
  OrderService
} from './order.service';
import {
  OrderController
} from './order.controller';
import {
  MongooseModule
} from '@nestjs/mongoose';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { Order, OrderSchema } from 'src/model/order.model';
import { CustomerModule } from 'src/customer/customer.module';
import { DishModule } from 'src/dish/dish.module';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  imports: [
     RestaurantModule,
     CustomerModule,
     DishModule,
     CouponModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema
      },
    ])
  ],

  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }