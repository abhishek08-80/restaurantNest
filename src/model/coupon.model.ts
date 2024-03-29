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

export type CouponDocument = Coupon & Document;

@Schema()
export class Coupon {

    @IsString()
    @Prop({ default: () => nanoid() })
    _id: String;

    @Prop()
    couponCode: String;

    @Prop()
    couponDiscription: String;
    
    @Prop()
    discountInPercentage: Number;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ default: () => moment(Date.now()) })
    createdAt: Number;

    @Prop({ default: () => moment(Date.now()) })
    updatedAt: Number;

}

export const CouponSchema = SchemaFactory.createForClass(Coupon);