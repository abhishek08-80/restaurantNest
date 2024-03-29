import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { EmployeeModule } from './employee/employee.module';
import { DishModule } from './dish/dish.module';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';


@Module({
  imports: [
    RestaurantModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/Restaurant'),
    CustomerModule,
    EmployeeModule,
    AuthModule,
    DishModule,
    OrderModule,
    CouponModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

