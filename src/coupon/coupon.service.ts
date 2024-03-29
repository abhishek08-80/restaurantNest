import {
  Injectable
} from '@nestjs/common';
import {
  InjectModel
} from '@nestjs/mongoose';
import {
  Model
} from 'mongoose';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { CustomerService } from 'src/customer/customer.service';
import { DishService } from 'src/dish/dish.service';
import { Coupon, CouponDocument } from 'src/model/coupon.model';
import { CreateCouponDto } from 'src/dto/coupon.dto';
import * as moment from 'moment';
import { any } from 'joi';



@Injectable()
export class CouponService {

  constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>,
    private restaurantModel: RestaurantService,
    private customerModel: CustomerService,
    private dishModel: DishService,

  ) { }

  async create(createCouponDto: CreateCouponDto): Promise<CouponDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try {
      const { couponCode, discount, startDate, endDate }: any = createCouponDto;
      // console.log(startDate, endDate, discount)

      return await this.couponModel.create(createCouponDto)
    } catch (error) {
      return error
    }
  }

  async findAll(model: any) {
    // const result: any = { data: [], metadata: [], error: null }

    try {

      return await this.couponModel.find()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findByAttribute(couponCode: any) {
    try { 
      
      return this.couponModel.findOne({couponCode}).lean();
      
    } catch (error) {
      throw error
    }
  }




  async remove(id: string) {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const findCoupon = this.couponModel.findOne({ id })
      if (!findCoupon) {
        result.error = { message: "coupon does not exists" }
        return result
      }
      const removeCoupon = this.couponModel.findByIdAndDelete(id);
      result.data = { message: "coupon deleted successfully" }
      return result

    } catch (error) {
      return error
    }
  }



}