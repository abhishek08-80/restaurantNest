import {
  Prop,
  Schema,
  SchemaFactory
} from '@nestjs/mongoose';
import { IsNumber, IsObject, IsString } from 'class-validator'
import * as moment from 'moment';

import {
  Document, now
} from 'mongoose';
import {
  nanoid
} from 'nanoid';
import { Category } from 'src/utills/enums/enum';
import { Restaurant } from './restaurant.model';

export type DishDocument = Dish & Document;

@Schema()
export class Dish {

  @IsString()
  @Prop({ default: () => nanoid() })
  _id: String;

  @Prop({ default: false, required: true })
  name: String;

  @Prop()
  slug: String;

  @Prop()
  price: Number;

  @Prop({ default: Category})
  category: String;

  @Prop({ default: () => moment() })
  createdAt: Number;

  @Prop({ default: () => moment() })
  updatedAt: Number;

  @Prop()
  restaurantId: String;
  ref: Restaurant

  @Prop({ default: true })
  isActive: boolean;

}

export const DishSchema = SchemaFactory.createForClass(Dish);