import {
  Prop,
  Schema,
  SchemaFactory
} from '@nestjs/mongoose';
import { IsNumber, IsObject, IsString } from 'class-validator'
import {
  Document, now
} from 'mongoose';
import {
  nanoid
} from 'nanoid';
import * as moment from 'moment';



export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {

  @IsString()
  @Prop({ default: () => nanoid() })
  _id: String;

  @Prop({ default: false, required: true })
  name: String;

  @Prop()
  email: String;

  @Prop()
  address: String;

  @Prop()
  password: String;


  @Prop({default: () => moment()})
  createdAt: Number;

  @Prop({default: () => moment()})
  updatedAt: Number;

  @Prop()
  otp: Number;

  @Prop()
  otpExpiration: Number;


  @Prop({ default: true })
  isActive: Boolean;


  @Prop()
  startTime: Number;
   

  @Prop()
  endTime: Number;
}
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);