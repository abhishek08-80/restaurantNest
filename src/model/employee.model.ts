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
import { Role } from 'src/utills/enums/enum';
import { Restaurant } from './restaurant.model';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {

  @IsString()
  @Prop({ default: () => nanoid() })
  _id: string;

  @Prop({ default: false, required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  password: string;

  @Prop({ default: Role.Staff })
  role: string;

  @Prop({ default: () => moment() })
  createdAt: Number;

  @Prop({ default: () => moment() })
  updatedAt: Number;

  @Prop()
  otp: number;

  @Prop()
  otpExpiration: number;

  @Prop()
  restaurantId: string;
  ref: Restaurant

  @Prop({ default: true })
  isActive: boolean;

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);