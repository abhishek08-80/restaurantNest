import {
  Module, forwardRef
} from '@nestjs/common';
import {
  DishService
} from './dish.service';
import {
  DishController
} from './dish.controller';
import {
  MongooseModule
} from '@nestjs/mongoose';
import { Dish, DishSchema } from 'src/model/dish.model';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
     RestaurantModule,
    MongooseModule.forFeature([
      {
        name: Dish.name,
        schema: DishSchema
      },
    ])
  ],

  controllers: [DishController],
  providers: [DishService],
  exports: [DishService]
})
export class DishModule { }