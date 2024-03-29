import {
  Injectable
} from '@nestjs/common';
import {
  InjectModel
} from '@nestjs/mongoose';
import {
  Model
} from 'mongoose';
import slugify from "slugify";
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Order, OrderDocument } from 'src/model/order.model';
import { CreateOrderDto } from 'src/dto/order.dto';
import { CustomerService } from 'src/customer/customer.service';
import { DishService } from 'src/dish/dish.service';
import { CouponService } from 'src/coupon/coupon.service';



@Injectable()
export class OrderService {

  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private restaurantModel: RestaurantService,
    private customerModel: CustomerService,
    private dishModel: DishService,
    private couponModel: CouponService,


  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const result: any = { data: [], metadata: null, error: [] }

    try { 
      const { restaurantId, customerId, dishId, couponCode }: any = createOrderDto;
      const validRestaurant = await this.restaurantModel.findOne(restaurantId)
      if (!validRestaurant) {
        result.error = { message: "restaurant does not exists" }
        return result
      }

      const validCustomer = await this.customerModel.findOne(customerId)
      if (!validCustomer) {
        result.error = { message: "customer does not exists" }
        return result
      }

      if (couponCode) {
        const validCoupon = await this.couponModel.findByAttribute(couponCode)
        console.log(validCoupon)
        if (!validCoupon) {
          result.error = { message: "invalid coupon" }
          return result
        }
        const endindDate = new Date(validCoupon.endDate)
        const endTimeStamp = Math.floor(endindDate.getTime() / 1000);
        const startingDate = new Date(validCoupon.startDate)
        const startTimeStamp = Math.floor(startingDate.getTime() / 1000);
        const currentdate = new Date()
        const currentTimeStamp = Math.floor(currentdate.getTime() / 1000);

        if (startTimeStamp < currentTimeStamp && endTimeStamp < currentTimeStamp) {
          result.error = { message: "coupon expired" }
          return result
        }

        const validDish = await this.dishModel.findByAttribute(dishId)

        if (!validDish) {
          result.error = { message: "dish does not exists" }
          return result
        }
        const prices = validDish.map(a => a.price)
        console.log(prices, 'xdfghjhgff', validDish)
        let sum = 0;

        for (let i = 0; i < prices.length; i++) {
          sum += prices[i];
        }

        let discount: any = validCoupon.discountInPercentage
        const discountInPrice = discount / 100 * sum

        const discountedPrice = sum - discountInPrice

        createOrderDto.totalPrice = discountedPrice
      } else {

        const validDish = await this.dishModel.findByAttribute(dishId)

        if (!validDish) {
          result.error = { message: "dish does not exists" }
          return result
        }
        const prices = validDish.map(a => a.price)
        console.log(prices, 'xdfghjhgff', validDish)
        let sum = 0;

        for (let i = 0; i < prices.length; i++) {
          sum += prices[i];
        }

        createOrderDto.totalPrice = sum

      }
      const newOrder = await this.orderModel.create(createOrderDto)
      return newOrder
    } catch (error) {
      console.log('error:', error)
      return error
    }
  }

  async findAll(model: any): Promise<OrderDocument[]> {
    const result: any = { data: [], metadata: [], error: null }

    try {
      const page = model.page
      const search = model.search
      let limit = model.limit;
      if (!limit) {
        limit = 2
      }
      if (search == undefined) {
        result.data = await this.orderModel.find().limit(limit).skip((page - 1) * limit).sort({ name: -1 });
      }
      else {
        result.data = await this.orderModel.find(
          {
            '$or': [
              { 'name': { $regex: model.search } },
              { 'category': { $regex: model.search } }
            ]
          }
        ).limit(limit).skip((page - 1) * limit).sort({ name: -1 });

      }
      result.metadata = await this.orderModel.countDocuments()

      return result

    } catch (error) {
      console.log(error)
      throw error
    }
  }






  async findOne(id: string) {
    return this.orderModel.findById(id);
  }

  // async updateDetails(id: string, updateCustomerDto: UpdateCustomerDto): Promise<EmployeeDocument> {
  //   const result: any = { data: [], metadata: null, error: [] }

  //   try {
  //     const { hobbies, ...rest } = updateCustomerDto;
  //     const existingUser = await this.orderModel.findOne({ _id: id }).lean()
  //     if (!existingUser) {
  //       result.error = { message: "Employee does not exists" }
  //       return result
  //     }
  //     const updatedHobbies = [...existingUser.hobbies, ...updateCustomerDto.hobbies];

  //     const finlaobj = { ...updatedHobbies, ...rest }
  //     console.log(finlaobj, 'dddddd')
  //     return await this.orderModel.findByIdAndUpdate(id, { $set: (finlaobj) }, { new: true });
  //   } catch (error) {
  //     console.log(error)
  //     return error
  //   }
  // }





  async remove(id: string) {
    const result: any = { data: [], metadata: null, error: [] }
    try {
      const findEmployee = this.orderModel.findOne({ id })
      if (!findEmployee) {
        result.error = { message: "employee does not exists" }
        return result
      }
      const removeEmployee = this.orderModel.findByIdAndDelete(id);

    } catch (error) {
      return error
    }
  }



}