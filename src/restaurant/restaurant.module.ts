import {
  Module, forwardRef
} from '@nestjs/common';
import {
  RestaurantService
} from './restaurant.service';
import {
  RestaurantController
} from './restaurant.controller';
import {
  Restaurant,
  RestaurantSchema
} from '../model/restaurant.model';
import {
  MongooseModule
} from '@nestjs/mongoose';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Restaurant.name,
        schema: RestaurantSchema
      },
    ]),
  ],

  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule {}