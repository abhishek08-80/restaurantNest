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
import { Category, Status } from 'src/utills/enums/enum';
import { Restaurant } from './restaurant.model';

export type OrderDocument = Order & Document;

@Schema()
export class Order {

    @IsString()
    @Prop({ default: () => nanoid() })
    _id: String;

    @Prop({ required: true })
    customerId: String;

    @Prop({ required: true })
    restaurantId: String;

    @Prop({ required: true })
    dishId: [String];

    @Prop({ required: true })
    couponId: [String];

    @Prop()
    totalPrice: Number;

    @Prop()
    count: Number;

    @Prop({ default: () => moment(Date.now()) })
    createdAt: Number;

    @Prop({ default: () => moment(Date.now()) })
    updatedAt: Number;

    @Prop({ default: Status.preparing })
    orderStatus: string;

}

export const OrderSchema = SchemaFactory.createForClass(Order);