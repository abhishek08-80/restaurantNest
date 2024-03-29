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
import { Hobbies, Role } from 'src/utills/enums/enum';

  export type CustomerDocument = Customer & Document;
  
  @Schema()
  export class Customer {
    
    @IsString()
    @Prop({ default: () => nanoid() }) 
    _id: string;

    @Prop({default:false, required:true})
    firstName: string;

    @Prop()
    lastName: string;
  
    @Prop()
    email: string;
  
    @Prop()
    address: string;
    
    @Prop()
    password: string;

    @Prop({default: Role.Customer})
    role: string;

    @Prop({default: () => moment()})
    createdAt: Number;
  
    @Prop({default: () => moment()})
    updatedAt: Number;
  

    @Prop({default: []})
    hobbies: Hobbies[];
    type:[string];
    enum: [Hobbies]

    @Prop()
    otp: number;

    @Prop()
    otpExpiration: number;
  }
  
  export const CustomerSchema = SchemaFactory.createForClass(Customer);

